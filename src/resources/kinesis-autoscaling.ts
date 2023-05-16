import { CfnResource } from "aws-cdk-lib";
import { Baselime as Config } from "../config";

import * as cdk from "aws-cdk-lib/core";
import {Duration} from "aws-cdk-lib/core";
import * as sns from "aws-cdk-lib/aws-sns";
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambdaEventSources from "aws-cdk-lib/aws-lambda-event-sources";
import { KinesisScaling } from "../types/kinesis-scaling";

export class KinesisAlarm extends CfnResource {
    constructor(id: string, props: KinesisScaling) {
        const parameters = {
            ...props.parameters,
        }

        const { streamName, streamArn, construct } = props.parameters;


        const kinesisScalingSnsTopic = new sns.Topic(construct, "kinesisAutoScalingSnsTopic", {
            displayName: "kinesisAutoScaling",
            topicName: `${id}-kinesisScalingSnsTopic`,
        });
        new ssm.StringParameter(construct, "kinesis-autoscaling-topic-arn", {
            parameterName: `/baselime/kinesis-auto-scaling/sns-topic-arn`,
            stringValue: kinesisScalingSnsTopic.topicArn,
            description: "Contains parameters required for scaling kinesis stream",
            type: ssm.ParameterType.STRING,
            tier: ssm.ParameterTier.STANDARD,
            allowedPattern: ".*",
        });

        const scalingFunction = new lambda.Function(construct, "kinesis-scaler", {
            code: lambda.Code.fromAsset("../lambda-functions"),
            functionName: `${id}-kinesis-scaler`,
            handler: "kinesisScaling.main",
            memorySize: 128,
            timeout: Duration.seconds(120),
            runtime: lambda.Runtime.NODEJS_14_X,
            environment: {
                MAX_SHARDS: "32",
            },
        });
        scalingFunction.addToRolePolicy(
            new iam.PolicyStatement({
                actions: [
                    "kinesis:UpdateShardCount",
                    "kinesis:ListShards",
                    "kinesis:DescribeStreamSummary",
                ],
                effect: iam.Effect.ALLOW,
                resources: [
                    "arn:aws:kinesis:*:*:stream/*",
                ],
            })
        )
        scalingFunction.addToRolePolicy(
            new iam.PolicyStatement({
                actions: [
                    "cloudwatch:DescribeAlarms",
                ],
                effect: iam.Effect.ALLOW,
                resources: [
                    "arn:aws:cloudwatch:*:*:alarm:*",
                ],
            })
        )
                

        const scaleInvoke = new tasks.LambdaInvoke(construct, "Scaling invocation", {
            lambdaFunction: scalingFunction,
            comment: "Invoke the scaling function",
            resultPath: "$.LambdaOutput",
        });

        const scaleWait = cdk.Duration.minutes(2);
        const waitX = new sfn.Wait(construct, `Wait ${scaleWait.toMinutes()} minutes`, {
            time: sfn.WaitTime.duration(scaleWait),
        }).next(scaleInvoke);

        const choice = new sfn.Choice(construct, 'Should sleep?', {
            inputPath: '$.LambdaOutput.Payload.result',
        })
            .when(sfn.Condition.booleanEquals('$.shouldSleep', true), waitX)
            .otherwise(new sfn.Pass(construct, 'Scaling complete'));

        scaleInvoke.next(choice);

        const stateMachine = new sfn.StateMachine(construct, "kinesis-scaler-state-machine", {
            definition: scaleInvoke,
            stateMachineName: "kinesis-scaler-state-machine",
        });

        new lambda.Function(construct, "kinesis-scaler-entry", {
            code: lambda.Code.fromAsset("../lambda-functions"),
            functionName: `${id}-kinesis-scaler`,
            handler: "kinesisScalingStart.main",

            timeout: Duration.seconds(120),
            memorySize: 128,
            runtime: lambda.Runtime.NODEJS_14_X,
            events: [new lambdaEventSources.SnsEventSource(kinesisScalingSnsTopic)],
            environment: {
                STATE_MACHINE_ARN: stateMachine.stateMachineArn,
            },
        });
        scalingFunction.addToRolePolicy(
            new iam.PolicyStatement({
                actions: [
                    "states:StartExecution",
                ],
                effect: iam.Effect.ALLOW,
                resources: [
                    stateMachine.stateMachineArn,
                ],
            })
        )

        super(Config.construct, id, {
            type: "Custom::BaselimeKinesisAutoscaling",
            properties: {
                id,
                Description: props.description,
                Parameters: parameters,
                Origin: "cdk"
            },
        });
    }
}

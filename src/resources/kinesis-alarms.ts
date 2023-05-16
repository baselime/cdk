import { CfnResource, Stack } from "aws-cdk-lib";
import { Baselime as Config } from "../config";

import {Duration} from "aws-cdk-lib/core";
import * as cw from "aws-cdk-lib/aws-cloudwatch";
import * as cwActions from "aws-cdk-lib/aws-cloudwatch-actions";
import * as sns from "aws-cdk-lib/aws-sns";
import * as ssm from 'aws-cdk-lib/aws-ssm';

import { KinesisAlarm } from "../types/kinesis-scaling";

export class KinesisAlarms extends CfnResource {
    constructor(id: string, props: KinesisAlarm) {
        const parameters = {
            ...props.parameters,
        }
        const { streamName, streamArn, construct } = props.parameters;

        const scaleUpAlarmName = `${streamName}-scale-up`;
        const scaleDownAlarmName = `${streamName}-scale-up`;

        const evaluationPeriodMinutes = 1;
        const evaluationPeriodSeconds = 60 * evaluationPeriodMinutes;


        const scaleUpEvalPeriods = 5;
        const scaleUpDataPointsRequired = 5;
        const scaleUpThreshold = 0.75;


        const scaleDownEvalPeriods = 120;
        const scaleDownThreshold = 0.25;
        const scaleDownDataPointsRequired = 120;



        const s1 = new cw.MathExpression({
            expression: "DATAPOINT_COUNT(bytesPerShard)",
            label: "ShardCount",
            usingMetrics: {
                bytesPerShard: new cw.MathExpression({
                    expression: `SELECT COUNT(IncomingBytes) FROM SCHEMA("AWS/Kinesis", ShardId,StreamName) WHERE StreamName = '${streamName}' GROUP BY ShardId`,
                    period: Duration.minutes(evaluationPeriodMinutes),
                    label: "BytesPerShard",
                })
            }
        });

        const m1 = new cw.Metric({
            metricName: "IncomingBytes",
            namespace: "AWS/Kinesis",
            statistic: "Sum",
            label: "IncomingBytes",
            period: Duration.minutes(evaluationPeriodMinutes),
            dimensionsMap: {
                StreamName: streamName,
            }
        });
        const m2 = new cw.Metric({
            metricName: "IncomingRecords",
            namespace: "AWS/Kinesis",
            statistic: "Sum",
            label: "IncomingRecords",
            period: Duration.minutes(evaluationPeriodMinutes),
            dimensionsMap: {
                StreamName: streamName,
            }
        })

        const e1 = new cw.MathExpression({
            expression: "FILL(m1,0)",
            usingMetrics: {
                m1
            }
        });

        const e2 = new cw.MathExpression({
            expression: "FILL(m2,0)",
            usingMetrics: {
                m2
            }
        });

        const e3 = new cw.MathExpression({
            expression: `e1 / (1024 * 1024 * ${evaluationPeriodSeconds} * s1)`,
            usingMetrics: {
                e1,
                s1
            },
        });

        const e4 = new cw.MathExpression({
            expression: `e2 / (1000 * ${evaluationPeriodSeconds} * s1)`,
            usingMetrics: {
                e2,
                s1
            },
        });

        const alarmDescription = JSON.stringify({
            streamName,
            streamArn,
            scaleUpAlarmName,
            scaleDownAlarmName,
        });

        const scaleUpAlarm = new cw.Alarm(construct, 'kinesisScaleUp', {
            alarmName: scaleUpAlarmName,
            comparisonOperator: cw.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
            actionsEnabled: true,
            alarmDescription: alarmDescription,
            threshold: scaleUpThreshold,
            evaluationPeriods: scaleUpEvalPeriods,
            datapointsToAlarm: scaleUpDataPointsRequired,
            metric: new cw.MathExpression({
                label: `Percentage max utilisation of kinesis stream data or records per ${evaluationPeriodMinutes} minutes`,
                usingMetrics: {
                    e3,
                    e4,
                },
                expression: "MAX([e3, e4])",
                period: Duration.minutes(evaluationPeriodMinutes),
            }),
        });

        /**
         * Scale down scaleUpAlarm
         */
            // Iterator Age (in minutes) after which we begin blocking scale down
        const s2Val = 30;

        const m3 = new cw.Metric({
            metricName: "GetRecords.IteratorAgeMilliseconds",
            namespace: "AWS/Kinesis",
            statistic: "Maximum",
            label: "IteratorAgeMilliseconds",
            period: Duration.minutes(evaluationPeriodMinutes),
            dimensionsMap: {
                StreamName: streamName,
            },
        });
        const e5 = new cw.MathExpression({
            expression: `${scaleDownThreshold} * (FILL(m3, 0) * 1000 / ${evaluationPeriodSeconds}) / ${s2Val}`,
            usingMetrics: {
                m3,
            },
        });
        const scaleDownAlarm = new cw.Alarm(construct, 'kinesisScaleDown', {
            alarmName: scaleDownAlarmName,
            comparisonOperator: cw.ComparisonOperator.LESS_THAN_THRESHOLD,
            actionsEnabled: true,
            alarmDescription: alarmDescription,
            threshold: scaleDownThreshold,
            evaluationPeriods: scaleDownEvalPeriods,
            datapointsToAlarm: scaleDownDataPointsRequired,
            metric: new cw.MathExpression({
                expression: "IF(s1 > 1, MIN([MAX([e3, e4, e5]), TIME_SERIES(1)]), 1)",
                usingMetrics: {
                    e3,
                    e4,
                    e5
                },
                period: Duration.minutes(evaluationPeriodMinutes),
            }),
        });

        // Hook up the actions
        // Get the SNS topic for scaling
        const kinesisScalingSnsTopicArn = ssm.StringParameter.valueForStringParameter(construct, `/baselime/kinesis-auto-scaling/sns-topic-arn`);
        const kinesisScalingSnsTopic = sns.Topic.fromTopicArn(construct, 'kinesisScalingSnsTopic', kinesisScalingSnsTopicArn);
        scaleUpAlarm.addAlarmAction(new cwActions.SnsAction(kinesisScalingSnsTopic));
        scaleDownAlarm.addAlarmAction(new cwActions.SnsAction(kinesisScalingSnsTopic));



        super(Config.construct, id, {
            type: "Custom::BaselimeKinesisAlarms",
            properties: {
                id,
                Description: props.description,
                Parameters: parameters,
                Origin: "cdk"
            },
        });
    }
}

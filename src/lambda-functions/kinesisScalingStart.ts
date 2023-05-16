import {StepFunctions} from "aws-sdk";
import {Input} from "./kinesisScaling";

interface SNSMessageAttribute {
    Type: string;
    Value: string;
}

interface SNSMessageAttributes {
    [name: string]: SNSMessageAttribute;
}

interface SNSMessage {
    SignatureVersion: string;
    Timestamp: string;
    Signature: string;
    SigningCertUrl: string;
    MessageId: string;
    Message: string;
    MessageAttributes: SNSMessageAttributes;
    Type: string;
    UnsubscribeUrl: string;
    TopicArn: string;
    Subject: string;
    Token?: string;
}


interface SNSEventRecord {
    EventVersion: string;
    EventSubscriptionArn: string;
    EventSource: string;
    Sns: SNSMessage;
}

interface SNSEvent {
    Records: SNSEventRecord[];
}

type Message = {
    AlarmName: string,
    AlarmDescription: string,
    AWSAccountId: string,
    NewStateValue: string,
    NewStateReason: string,
    StateChangeTime: string,
    Region: string,
    OldStateValue: string,
    Trigger: {
        MetricName: string,
        Namespace: string,
        StatisticType: string,
        Statistic: string,
        Unit: string,
    }
}

type AlarmDescription = {
    streamArn: string;
    streamName: string;
    scaleUpAlarmName: string;
    scaleDownAlarmName: string;
}

const logger = {
    info: (message: string, data?: any) => console.log(JSON.stringify({message, data})),
}

export async function main(event: SNSEvent) {
    logger.info("Received the scaling event", { event });
    const stepFunctions = new StepFunctions();
    const input = prepareInput(event);
    logger.info("Prepared scaling function input", { input });
    await stepFunctions.startExecution({
        stateMachineArn: process.env.STATE_MACHINE_ARN!,
        input: JSON.stringify(input),
    }).promise();
}

function prepareInput(event: SNSEvent): Input {
    const message = event.Records[0].Sns.Message;
    const parsedMessage = JSON.parse(message) as Message;
    const description = JSON.parse(parsedMessage.AlarmDescription) as AlarmDescription;
    if (!description.streamName) {
        throw new Error("streamName is missing from the alarm description");
    }
    if (!description.scaleUpAlarmName) {
        throw new Error("scaleUpAlarmName is missing");
    }
    if (!description.scaleDownAlarmName) {
        throw new Error("scaleDownAlarmName is missing");
    }
    return {
        streamName: description.streamName,
        scaleUpAlarmName: description.scaleUpAlarmName,
        scaleDownAlarmName: description.scaleDownAlarmName,
    };
}
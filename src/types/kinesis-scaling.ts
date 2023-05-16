import {Construct} from "constructs";

export type KinesisAlarm = {
    description?: string;
    parameters: KinesisAlarmParameters;
};

export type KinesisAlarmParameters = {
    streamName: string;
    streamArn: string;
    construct: Construct;
}

export type KinesisScaling = {
    description?: string;
    parameters: KinesisAlarmParameters;
};

export type KinesisScalingParameters = {
    streamName: string;
    streamArn: string;
    construct: Construct;
}
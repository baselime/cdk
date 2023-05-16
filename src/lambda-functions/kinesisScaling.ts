import {CloudWatch, Kinesis} from "aws-sdk";

const logger = {
    info: (message: string, data?: any) => console.log(JSON.stringify({message, data})),
}

const maxShards = parseInt(process.env.MAX_SHARDS!) || 32;
const kinesis = new Kinesis();

enum ScalingNeed {
    ScaleUp = "SCALE_UP",
    ScaleDown = "SCALE_DOWN",
    None = "NONE",
}

enum Reasons {
    ScaleUp = "SCALE_UP",
    ScaleDown = "SCALE_DOWN",
    StreamNotActive = "STREAM_NOT_ACTIVE",
    NoScalingNeeded = "NO_SCALING_NEEDED",
}

export type Input = {
    scaleUpAlarmName: string;
    scaleDownAlarmName: string;
    streamName: string;
}

type Output = {
    result: {
        shouldSleep: boolean;
        reason: string;
        streamName: string;
        scaleUpAlarmName: string;
        scaleDownAlarmName: string;
        timestamp: number;
    }
}

export async function main(input: Input): Promise<Output> {
    logger.info("Received the scaling event", { input });
    if (!input.streamName) {
        throw new Error("streamName is missing from the alarm description");
    }
    const streamData = await kinesis.describeStreamSummary({
        StreamName: input.streamName,
    }).promise();
    if (streamData.StreamDescriptionSummary.StreamStatus != "ACTIVE") {
        return {
            result: {
                ...input,
                shouldSleep: true,
                timestamp: Date.now().valueOf(),
                reason: Reasons.StreamNotActive,
            }
        }
    }
    const shardCount = streamData.StreamDescriptionSummary.OpenShardCount || 0;
    const scalingNeed = await checkScalingNeeds(input, shardCount);
    let reason: string;
    switch (scalingNeed) {
        case ScalingNeed.ScaleUp:
            await scaleUp(input, shardCount);
            reason = Reasons.ScaleUp;
            break;
        case ScalingNeed.ScaleDown:
            await scaleDown(input, shardCount);
            reason = Reasons.ScaleDown;
            break;
        default:
            logger.info("No scaling needed");
            reason = Reasons.NoScalingNeeded;
    }
    return {
        result: {
            ...input,
            shouldSleep: scalingNeed != ScalingNeed.None,
            reason,
            timestamp: Date.now().valueOf(),
        }
    }
}

async function scaleUp(input: Input, currentShardCount: number) {
    if (currentShardCount >= maxShards) {
        logger.info("Already at max shard count");
        return;
    }
    logger.info("Scaling up");
    const kinesis = new Kinesis();
    const result = await kinesis.listShards({
        StreamName: input.streamName,
    }).promise()
    const shardCount = result.Shards?.length || 0;
    const targetShardCount = shardCount * 2;
    logger.info("Scaling up", {
        streamName: input.streamName,
        shardCount,
        targetShardCount,
    });
    await kinesis.updateShardCount({
        StreamName: input.streamName,
        ScalingType: "UNIFORM_SCALING",
        TargetShardCount: targetShardCount,
    }).promise();
    logger.info("Scaled up", {
        streamName: input.streamName,
        shardCount: targetShardCount,
    });
}

async function scaleDown(input: Input, currentShardCount: number) {
    logger.info("Scaling down");
    const targetShardCount = Math.ceil(currentShardCount / 2);
    logger.info("Scaling down", {
        streamName: input.streamName,
        currentShardCount,
        targetShardCount,
    });
    await kinesis.updateShardCount({
        StreamName: input.streamName,
        ScalingType: "UNIFORM_SCALING",
        TargetShardCount: targetShardCount,
    }).promise();
    logger.info("Scaled down", {
        streamName: input.streamName,
        shardCount: targetShardCount,
    });
}

async function checkScalingNeeds(input: Input, currentShardCount: number): Promise<ScalingNeed> {
    const cw = new CloudWatch();
    const alarmStates = await cw.describeAlarms({
        AlarmNames: [
            input.scaleUpAlarmName,
            input.scaleDownAlarmName,
        ],
    }).promise();
    logger.info("Alarm states", { alarmStates });
    const scaleUpAlarm = alarmStates.MetricAlarms?.find((a) => a.AlarmName === input.scaleUpAlarmName);
    const scaleDownAlarm = alarmStates.MetricAlarms?.find((a) => a.AlarmName === input.scaleDownAlarmName);
    if (scaleUpAlarm?.StateValue === "ALARM") {
        return ScalingNeed.ScaleUp;
    }
    if (scaleDownAlarm?.StateValue === "ALARM" && currentShardCount > 1) {
        return ScalingNeed.ScaleDown;
    }
    return ScalingNeed.None;
}
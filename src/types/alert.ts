import { CfnResource } from "aws-cdk-lib";
import { QueryOperationString, QueryParameters } from "./query";

export type AlertProps<TKey extends string> = {
	description?: string;
	enabled?: boolean;
	parameters: {
		query: CfnResource | QueryParameters<TKey>,
		threshold?: {
			operation?: QueryOperationString,
			value: string | number
		},
		frequency?: string,
		window?: string,
	};
	channels?: Channel[];
};

export type Channel = { type: ChannelTypes; targets: string[] }

type ChannelTypes = "slack" | "webhook" | "email";

export type DeploymentAlertParameters = {
	query: string;
	threshold: {
		operation?: QueryOperationString,
		value: string | number
	};
	frequency: string;
	window: string;
};

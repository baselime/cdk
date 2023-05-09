import { CfnResource } from "aws-cdk-lib";
import { QueryOperationString, QueryParameters } from "./Query";

export type AlertProps<TKey extends string> = {
	description?: string;
	enabled?: boolean;
	parameters: {
		query: CfnResource | QueryParameters<TKey>,
		threshold: {
			operation?: QueryOperationString,
			value: string | number
		},
		frequency?: string,
		window?: string,
	};
	channels?: { type: ChannelTypes; targets: string[] }[];
};

type ChannelTypes = "slack" | "webhook";

export type DeploymentAlertParameters = {
	query: string;
	threshold: string;
	frequency: string;
	window: string;
};

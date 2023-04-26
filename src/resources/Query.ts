import { CfnResource } from "aws-cdk-lib";
import { ConfigStore } from "../Config";
import * as cdk from "aws-cdk-lib/core";
import { QueryProps } from "../types/Query";

export class Query extends CfnResource {
	constructor(id: string, props: QueryProps) {
		const stack = cdk.Stack.of(ConfigStore.construct);

		super(ConfigStore.construct, id, {
			type: "Custom::BaselimeQuery",
			properties: {
				serviceToken: ConfigStore.serviceToken,
				BaselimeApiKey: ConfigStore.baselimeSecret,
				Description: props.description,
				Service: stack.stackName,
				Parameters: props.parameters
			},
		});
	}
}

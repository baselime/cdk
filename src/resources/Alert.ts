import { CfnResource } from "aws-cdk-lib";
import { ConfigStore } from "../Config";
import * as cdk from "aws-cdk-lib/core";
import { AlertProps } from "../types/Alert";

export class Alert extends CfnResource {
	constructor(id: string, props: AlertProps) {
		const stack = cdk.Stack.of(ConfigStore.construct);

		super(ConfigStore.construct, id, {
			type: "Custom::BaselimeAlert",
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

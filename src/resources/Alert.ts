import { CfnResource, Stack } from "aws-cdk-lib";
import { ConfigStore } from "../Config";

import { AlertProps } from "../types/Alert";

export class Alert extends CfnResource {
	constructor(id: string, props: AlertProps) {
		const stack = Stack.of(ConfigStore.construct);

		super(ConfigStore.construct, id, {
			type: "Custom::BaselimeAlert",
			properties: {
				ServiceToken: ConfigStore.serviceToken,
				BaselimeApiKey: ConfigStore.baselimeSecret,
				Description: props.description,
				Service: stack.stackName,
				Parameters: props.parameters
			},
		});
	}
}

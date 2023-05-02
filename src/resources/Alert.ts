import { CfnResource, Stack } from "aws-cdk-lib";
import { Config } from "../Config";

import { AlertProps } from "../types/Alert";

export class Alert extends CfnResource {
	constructor(id: string, props: AlertProps) {
		const stack = Stack.of(Config.construct);

		super(Config.construct, id, {
			type: "Custom::BaselimeAlert",
			properties: {
				ServiceToken: Config.serviceToken,
				BaselimeApiKey: Config.baselimeSecret,
				Description: props.description,
				Service: stack.stackName,
				Parameters: props.parameters,
				Origin: "cdk"
			},
		});
	}
}

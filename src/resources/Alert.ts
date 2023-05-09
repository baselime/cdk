import { CfnResource, Stack } from "aws-cdk-lib";
import { Config } from "../Config";

import { AlertProps } from "../types/Alert";
import { getServiceName } from "../utils/ServiceName";

export class Alert extends CfnResource {
	constructor(id: string, props: AlertProps) {
		const stack = Stack.of(Config.construct);

		const parameters = {
			...props.parameters,
			query: props.parameters.query.ref
		}
		super(Config.construct, id, {
			type: "Custom::BaselimeAlert",
			properties: {
				ServiceToken: Config.serviceToken,
				BaselimeApiKey: Config.baselimeSecret,
				Description: props.description,
				Service: getServiceName(stack),
				Parameters: parameters,
				Origin: "cdk"
			},
		});
	}
}

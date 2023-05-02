import { CfnResource, Stack } from "aws-cdk-lib";
import { Config } from "../Config";

import { DashboardProps } from "../types/Dashboard";

export class Dashboard extends CfnResource {
	constructor(id: string, props: DashboardProps) {
		const stack = Stack.of(Config.construct);

		super(Config.construct, id, {
			type: "Custom::BaselimeDashboard",
			properties: {
				ServiceToken: Config.serviceToken,
				BaselimeApiKey: Config.baselimeSecret,
				Description: props.description,
				Service: stack.stackName,
				Parameters: props.parameters
			},
		});
	}
}

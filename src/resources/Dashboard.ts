import { CfnResource } from "aws-cdk-lib";
import { ConfigStore } from "../Config";
import * as cdk from "aws-cdk-lib/core";
import { DashboardProps } from "../types/Dashboard";

export class Dashboard extends CfnResource {
	constructor(id: string, props: DashboardProps) {
		const stack = cdk.Stack.of(ConfigStore.construct);

		super(ConfigStore.construct, id, {
			type: "Custom::BaselimeDashboard",
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

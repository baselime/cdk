import { CfnResource, Stack } from "aws-cdk-lib";
import { Config } from "../Config";

import { DashboardProps } from "../types/Dashboard";

export class Dashboard extends CfnResource {
	constructor(id: string, props: DashboardProps) {
		const stack = Stack.of(Config.construct);
		
		const parameters = {
			...props.parameters,
			widgets: props.parameters.widgets.map(el => ({ ...el, query: el.query.ref }))
		}

		super(Config.construct, id, {
			type: "Custom::BaselimeDashboard",
			properties: {
				ServiceToken: Config.serviceToken,
				BaselimeApiKey: Config.baselimeSecret,
				Description: props.description,
				Service: stack.tags.tagValues()["sst:app"] || stack.stackName,
				Parameters: parameters,
				Origin: "cdk"
			},
		});
	}
}

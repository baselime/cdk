import { CfnResource, Stack } from "aws-cdk-lib";
import { Baselime as Config } from "../config";

import { DashboardProps } from "../types/dashboard";
import { getServiceName } from "../utils/service-name";

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
				id, 
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

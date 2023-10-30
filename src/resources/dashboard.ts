import { CfnResource, Stack } from "aws-cdk-lib";
import { Baselime as Config } from "../config";

import { DashboardProps } from "../types/dashboard";
export { WidgetType } from "../types/dashboard";
export class Dashboard extends CfnResource {
	constructor(id: string, props: DashboardProps) {

		const parameters = {
			...props.parameters,
			widgets: props.parameters.widgets.map(el => ({ ...el, query: el.query.ref }))
		}

		super(Config.getConstruct(), id, {
			type: "Custom::BaselimeDashboard",
			properties: {
				id,
				ServiceToken: Config.getServiceToken(),
				BaselimeApiKey: Config.getApiKey(),
				Description: props.description,
				Parameters: parameters,
				Origin: "cdk"
			},
		});
	}
}

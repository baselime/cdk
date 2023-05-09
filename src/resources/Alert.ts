import { CfnResource, Stack } from "aws-cdk-lib";
import { Config } from "../Config";
import { Query } from "./Query";
import { AlertProps, DeploymentAlertParameters } from "../types/Alert";
import { QueryProps } from "../types/Query";
import { getServiceName } from "../utils/ServiceName";

export class Alert<TKey extends string> extends CfnResource {
	constructor(id: string, props: AlertProps<TKey>) {
		const stack = Stack.of(Config.construct);

		let Parameters: DeploymentAlertParameters;

		if ("ref" in props.parameters.query) {
			Parameters = {
				...props.parameters,
				threshold: `${props.parameters.threshold.operation || ">"} ${
					props.parameters.threshold.value
				}`,
				query: props.parameters.query.ref,
				frequency: props.parameters.frequency || "1 hour",
				window: props.parameters.window || "1 hour",
			};
		}

		if ("filters" in props.parameters.query) {
			const query = new Query(`${id}-query`, {
				parameters: {
					...props.parameters.query,
					calculations: props.parameters.query.calculations || [
						{ operation: "COUNT" },
					],
				},
			});

			Parameters = {
				...props.parameters,
				threshold: `${props.parameters.threshold.operation || ">"} ${
					props.parameters.threshold.value
				}`,
				query: query.ref,
				frequency: props.parameters.frequency || "1 hour",
				window: props.parameters.window || "1 hour",
			};
		}

		super(Config.construct, id, {
			type: "Custom::BaselimeAlert",
			properties: {
				id,
				ServiceToken: Config.serviceToken,
				BaselimeApiKey: Config.baselimeSecret,
				enabled: props.enabled,
				Description: props.description,
				Service: getServiceName(stack),
				Parameters,
				Channels: props.channels || [
					{ type: "slack", targets: ["baselime-alerts"] },
				],
				Origin: "cdk",
			},
		});
	}
}

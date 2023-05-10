import { CfnResource, Stack } from "aws-cdk-lib";
import { Config } from "../config";
import { Query } from "./query";
import { AlertProps, DeploymentAlertParameters } from "../types/alert";
import { QueryProps } from "../types/query";
import { getServiceName } from "../utils/service-name";

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
				frequency: props.parameters.frequency,
				window: props.parameters.window,
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
				threshold: `${props.parameters.threshold?.operation || ">"} ${
					props.parameters.threshold?.value || 0
				}`,
				query: query.ref,
				frequency: props.parameters.frequency,
				window: props.parameters.window,
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
				Channels: props.channels || Config.defaultChannel && [Config.defaultChannel],
				Origin: "cdk",
			},
		});
	}
}
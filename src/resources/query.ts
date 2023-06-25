import { CfnResource, Stack } from "aws-cdk-lib";
import { Baselime as Config } from "../config";

import { QueryProps, Filter, DeploymentQueryParameters } from "../types/query";
import { AlertProps } from "../types/alert";
import { Alert } from './alert';
import { getServiceName } from '../utils/service-name';

function buildCalculation(cal: { alias?: string; operation: string; key?: string }) {
	const short = buildShortCalculation(cal);
	return `${short}${cal.alias ? ` as ${cal.alias}` : ""}`;
}

function hasDuplicates<T>(array: T[]) {
	return (new Set(array)).size !== array.length;
}

function buildShortCalculation(cal: { alias?: string; operation: string; key?: string }) {
	if (cal.operation === "COUNT") {
		return cal.operation;
	}
	return `${cal.operation}(${cal.key})`;
}

function getCalculationAlias(cal: { alias?: string; operation: string; key?: string }) {
	return cal.alias ? cal.alias : buildShortCalculation(cal);
}

export function stringifyFilter(filter: Filter): string {
	const { key, operation, value } = filter;
	if (!operation) {
		return `${key} = ${value}`;
	}
	if (["EXISTS", "DOES_NOT_EXIST"].includes(operation)) {
		return `${key} ${operation}`;
	}
	if (["IN", "NOT_IN"].some(o => o === operation)) {
		return `${key} ${operation} (${value})`;
	}
	return `${key} ${operation} ${value}`;
}

/**
 * 
 */
export class Query<TKey extends string> extends CfnResource {
	id: string;
	props: QueryProps<TKey>
	constructor(id: string, props: QueryProps<TKey>) {
		const stack = Stack.of(Config.getConstruct());

		const calcs = props.parameters.calculations;
		const orderByOptions = calcs?.map(cal => getCalculationAlias(cal));

		if (calcs?.length && hasDuplicates(calcs.filter(c => c.alias).map(c => c.alias))) {
			throw Error("Aliases must me unique across all calculations / visualisations.")
		}

		if (props.parameters.orderBy && !orderByOptions?.includes(props.parameters.orderBy.value)) {
			throw Error("The orderBy must be present in the calculations / visualisations.")
		}

		if (!props.disableStackFilter || !Config.getDisableStackFilter()) {
			props.parameters.filters?.push({ operation: "=", key: "$baselime.stackId", value: stack.stackName })
		}

		const Parameters: DeploymentQueryParameters = {
			...props.parameters,
			datasets: props.parameters.datasets || ['lambda-logs'],
			calculations: props.parameters.calculations ? props.parameters.calculations.map(buildCalculation) : [],
			filters: props.parameters.filters?.map(stringifyFilter),
			groupBys: props.parameters.groupBys?.map(groupBy => {
				return {
					...groupBy,
					type: groupBy?.type || "string"
				}
			}),
			filterCombination: props.parameters.filterCombination || "AND",
		};

		super(Config.getConstruct(), id, {
			type: "Custom::BaselimeQuery",
			properties: {
				id,
				ServiceToken: Config.getServiceToken(),
				BaselimeApiKey: Config.getApiKey(),
				Description: props.description,
				Service: getServiceName(stack),
				Parameters,
				Origin: "cdk"
			},
		});
		this.id = id;
		this.props = props;
	}

	addAlert(alert: ChangeFields<AlertProps<TKey>, {
		parameters: Omit<AlertProps<TKey>['parameters'], "query">
	}>) {
		const alertProps = {
			...alert,
			parameters: {
				...alert.parameters,
				query: this
			}
		}

		new Alert(`${this.id}-alert`, alertProps);
	}

	addFilters(filters: QueryProps<string>["parameters"]["filters"]) {
		this.addPropertyOverride('Parameters.filters', [...filters || []])
	}
};

type ChangeFields<T, R> = Omit<T, keyof R> & R;

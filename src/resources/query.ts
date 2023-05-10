import { CfnResource, Stack } from "aws-cdk-lib";
import { Config } from "../config";

import { QueryProps, Filter, DeploymentQueryParameters } from "../types/query";
import { AlertProps } from "../types/alert";
import { Alert } from './alert';
import { getServiceName } from '../utils/service-name';

function buildCalculation(cal: { alias?: string; operation: string; key?: string}) {
	const short = buildShortCalculation(cal);
	return `${short}${cal.alias ? ` as ${cal.alias}` : ""}`;
}

function buildShortCalculation(cal:  { alias?: string; operation: string; key?: string}) {
	if (cal.operation === "COUNT") {
		return cal.operation;
	}
	return `${cal.operation}(${cal.key})`;
}

export function stringifyFilter(filter: Filter): string {
	const { key, operation, value } = filter;
	if(!operation) {
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
		const stack = Stack.of(Config.construct);
		
		const groupByOptions = props.parameters.calculations?.map(calc => calc.alias || calc.key || calc.operation);

		if(props.parameters.groupBy && !groupByOptions.includes(props.parameters.groupBy.value)) {
			throw Error("groupBy.value must be value of either alias, key, or operation")
		}
		
		const Parameters: DeploymentQueryParameters = {
			...props.parameters,
			datasets: props.parameters.datasets || ['lambda-logs'],
			calculations: props.parameters.calculations ? props.parameters.calculations.map(buildCalculation) : [],
			filters: props.parameters.filters.map(stringifyFilter),
			groupBy: {
				...props.parameters.groupBy,
				type: props.parameters.groupBy?.type || "string"
			}
		};

		super(Config.construct, id, {
			type: "Custom::BaselimeQuery",
			properties: {
				id,
				ServiceToken: Config.serviceToken,
				BaselimeApiKey: Config.baselimeSecret,
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
		
		this.addPropertyOverride('Parameters.filters', [...filters ])
	}
};

type ChangeFields<T, R> = Omit<T, keyof R> & R;

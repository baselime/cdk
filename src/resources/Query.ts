import { CfnResource } from "aws-cdk-lib";
import { ConfigStore } from "../Config";
import * as cdk from "aws-cdk-lib/core";
import { QueryParameters, QueryProps, Filter } from "../types/Query";
import { AlertProps } from "../types/Alert";
import { Alert } from './Alert';

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
	if (["EXISTS", "DOES_NOT_EXIST"].includes(operation)) {
	  return `${key} ${operation}`;
	}
	if (["IN", "NOT_IN"].some(o => o === operation)) {
	  return `${key} ${operation} (${value})`;
	}
	return `${key} ${operation} ${value}`;
  }


export  class Query<TKey extends string> extends CfnResource {
	id: string;
	props: QueryProps<TKey>
	constructor(id: string, props: QueryProps<TKey>) {
		const stack = cdk.Stack.of(ConfigStore.construct);
		
		const groupByOptions = props.parameters.calculations?.map(calc => calc.alias || calc.key || calc.operation);

		if(props.parameters.groupBy && !groupByOptions.includes(props.parameters.groupBy.value)) {
			throw Error("groupBy.value must be value of either alias, key, or operation")
		}
		
		const Parameters: QueryParameters = {
			...props.parameters,
			calculations: props.parameters.calculations ? props.parameters.calculations.map(buildCalculation) : [],
			filters: props.parameters.filters.map(stringifyFilter)
		};
		super(ConfigStore.construct, id, {
			type: "Custom::BaselimeQuery",
			properties: {
				serviceToken: ConfigStore.serviceToken,
				BaselimeApiKey: ConfigStore.baselimeSecret,
				Description: props.description,
				Service:  stack.tags.tagValues()["sst:app"] || stack.stackName,
				Parameters,
			},
		});
		this.addPropertyOverride
		this.id = id;
		this.props = props;
	}

	addAlert(alert: ChangeFields<AlertProps, { 
		parameters: Omit<AlertProps['parameters'], "query"> 
	  }>) {
		
		const alertProps = {
			...alert,
			parameters: {
				...alert.parameters,
				query: this.ref
			}
		}

		new Alert(`${this.id}-alert`, alertProps);
	}

	addFilters(filters: QueryProps<string>["parameters"]["filters"]) {
		
		this.addPropertyOverride('Parameters.filters', [...filters ])
	}
};

type ChangeFields<T, R> = Omit<T, keyof R> & R;
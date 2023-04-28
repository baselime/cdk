import { CfnResource } from "aws-cdk-lib";
import { ConfigStore } from "../Config";
import * as cdk from "aws-cdk-lib/core";
import { QueryParameters, QueryProps, Filter } from "../types/Query";

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
	constructor(id: string, props: QueryProps<TKey>) {
		const stack = cdk.Stack.of(ConfigStore.construct);
		
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
				Service: stack.stackName,
				Parameters,
			},
		});
	}
}

new Query('tttt', {
	parameters: {
		datasets: ['lambda-logs'],
		filters: [{
			key: 'blah', operation: '=', value: ''
		}],
		calculations: [{
			key: 'woop',
			alias: "aaa",
			operation: 'AVG'
		}, {
			operation: "COUNT"
		}],
		groupBy: {
			value: "woop",
			type: "string"
		}
	}
})
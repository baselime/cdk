import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export interface QueryProps {
	Description: string;
	Service: string;
	parameters: {
		Parameters: {
			datasets: string[];
			calculations:  string[];
			filters:  string[];
			groupBy: {
				value: string;
				type: string;
				orderBy: string;
				limit: number;
			};
		};
	};
}

let _baselimeApiKey: string;
let _serviceToken: string;
export function initBaselime({
	baselimeApiKey,
	serviceToken,
}: { baselimeApiKey: string; serviceToken?: string }) {
	_baselimeApiKey = baselimeApiKey;
	_serviceToken =
		serviceToken ||
		"arn:aws:lambda:eu-west-1:374211872663:function:uat-polaris-cloudformatio-providerframeworkonEvent-KGrsSG5COAEz";
}

export class Query extends cdk.CustomResource {
	constructor(scope: Construct, id: string, props: QueryProps) {
		if (!_baselimeApiKey) {
			throw Error(
				'BaselimeApiKey is missing, make sure you call initBaselime({ baselimeApiKey: "xxxxxxxxxxxx"',
			);
		}
        
		super(scope, id, {
			resourceType: "Custom::BaselimeQuery",
			serviceToken: _serviceToken,
			properties: props
		});

		// Implement the logic for your component here
	}
}

// Export the component as a module
export * from "./index";

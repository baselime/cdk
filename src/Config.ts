import { Construct } from "constructs";

interface BaselimeConfiguration {
	apiKey: string;
}

export namespace ConfigStore {
	export let construct: Construct;
	export let baselimeSecret: string;

	export const serviceToken = `arn:aws:lambda:${process.env.CDK_DEPLOY_REGION || 'eu-west-1'}:374211872663:function:baselime-orl-cloudformation`
	export function init(
		target: Construct,
		{ apiKey }: BaselimeConfiguration,
	) {
		construct = target;
		baselimeSecret = apiKey;
	}
}

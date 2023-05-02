import { Construct } from "constructs";

interface BaselimeConfiguration {
	apiKey: string;
	region?: string;
	_account?: string;
}

export namespace Config {
	export let construct: Construct;
	export let baselimeSecret: string;

	export let serviceToken: string;
	export function init(
		target: Construct,
		{ apiKey, region, _account }: BaselimeConfiguration,
	) {
		construct = target;
		baselimeSecret = apiKey;
		serviceToken = `arn:aws:lambda:${
			region || process.env.CDK_DEPLOY_REGION || "eu-west-1"
		}:${_account || "097948374213"}:function:baselime-orl-cloudformation`;
	}
}

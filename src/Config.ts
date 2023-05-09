import { Construct } from "constructs";

interface BaselimeConfiguration {
	apiKey: string;
	region?: string;
	serviceName?: string;
	_account?: string;
}

export namespace Config {
	export let construct: Construct;
	export let baselimeSecret: string;
	export let serviceName: string;
	export let serviceToken: string;
	export function init(
		target: Construct,
		options: BaselimeConfiguration,
	) {
		construct = target;
		baselimeSecret = options.apiKey;
		serviceName = options.serviceName;
		serviceToken = `arn:aws:lambda:${
			options.region || process.env.CDK_DEPLOY_REGION || "eu-west-1"
		}:${options._account || "097948374213"}:function:baselime-orl-cloudformation`;
	}
}

import { Construct } from "constructs";
import { Channel } from './types/alert';

interface BaselimeConfiguration {
	apiKey: string;
	region?: string;
	serviceName?: string;
	defaultChannel?: Channel;
	disableStackFilter?: boolean
	_account?: string;
}

export namespace Baselime {
	export let construct: Construct;
	export let baselimeSecret: string;
	export let serviceName: string;
	export let serviceToken: string;
	export let defaultChannel: Channel;
	export let disableStackFilter: boolean
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
		defaultChannel = options.defaultChannel;
		disableStackFilter = options.disableStackFilter;
	}
}

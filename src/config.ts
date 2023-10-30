import { Construct } from "constructs";
import { Channel } from './types/alert';

interface BaselimeConfiguration {
	/**
	 * The Baselime API key
	 */
	readonly apiKey: string;
	/**
	 * The region to deploy this Observability as Code to.
	 *
	 * @default - Defaults to the CDK_DEPLOY_REGION environment variable
	 */
	readonly region?: string;
	/**
	 * The channel to send all the alerts by default.
	 */
	readonly defaultChannel?: Channel;
	/**
	 * Wether or not to add a filter on stack name to all the queries
	 * When `disableStackFilter` is set to `true`, this filter is removed:
	 * `$baselime.stackId = stackName`
	 * 
	 * @default - Defaults to false
	 */
	readonly disableStackFilter?: boolean;
	/**
	 * The AWS Account ID where Baselime is deployed.
	 * Change this property only if you have self-deployed the entire Baselime BackEnd
	 * 
	 * @default - Defaults to the Baselime AWS Account ID
	 */
	readonly _account?: string;
}

export namespace Baselime {
	let construct: Construct;
	let baselimeSecret: string;
	let serviceToken: string;
	let defaultChannel: Channel | undefined;
	let disableStackFilter: boolean | undefined;

	/**
	 * Initialize Baselime CDK. Make sure to use this method in the beginning of the stack.
	 *
	 * @param {Construct} target
	 * @param {BaselimeConfiguration} options
	 * @example
	 * import { Baselime } from '@baselime/cdk'
	 * import * as cdk from 'aws-cdk-lib'
	 * import { Construct } from 'constructs'
	 *
	 * export class ExamplesStack extends cdk.Stack {
	 *   constructor(scope: Construct, id: string, props?: cdk.StackProps) {
	 *     super(scope, id, props)
	 *
	 *     Baselime.init(this, {
	 *       apiKey: process.env.BASELIME_API_KEY, // Ideally use SSM or Secrets Manager
	 *		   defaultChannel: { type: "slack", targets: ["baselime-alerts"] },
	 *     });
	 */
	export function init(
		target: Construct,
		options: BaselimeConfiguration,
	) {
		construct = target;
		baselimeSecret = options.apiKey;
		serviceToken = `arn:aws:lambda:${options.region || process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION || "eu-west-1"
			}:${options._account || "097948374213"}:function:baselime-orl-cloudformation`;
		defaultChannel = options.defaultChannel;
		disableStackFilter = options.disableStackFilter;
	}

	export function getConstruct() {
		return construct;
	}

	export function getApiKey() {
		return baselimeSecret;
	}

	export function getServiceToken() {
		return serviceToken;
	}

	export function getDefaultChannel() {
		return defaultChannel;
	}

	export function getDisableStackFilter() {
		return disableStackFilter;
	}
}

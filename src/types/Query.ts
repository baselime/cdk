import { F } from "ts-toolbelt";

export type QueryProps<TKey extends string> = {
	description?: string;
	parameters:
		| {
				datasets: Datasets[];
				filterCombination?: "AND" | "OR";
				filters: Filter[];
				needle?: Needle;
				calculations?: never;
				groupBy?: never;
		  }
		| {
				datasets: Datasets[];
				filterCombination?: "AND" | "OR";
				filters: Filter[];
				needle?: Needle;
				calculations: Calculation<TKey>[];
				groupBy?: {
					type: "string" | "number" | "boolean";
					// This doesn't quite work yet. It should be a union of the key in the filters
					value: F.NoInfer<TKey>;
					orderBy?: string;
					limit?: number;
					order?: "ASC" | "DESC";
				};
		  };
};

type Needle = {
	value: string;
	isRegex?: boolean;
	matchCase?: boolean;
};

type Datasets =
	| "lambda-logs"
	| "cloudwatch-metrics"
	| "apigateway-logs"
	| "cloudtrail"
	| "ecs-logs"
	| "otel"
	| "x-ray";

export type Calculation<TKey extends string> =
	| BaseCalculationObject<TKey>
	| CountCalculation<TKey>;
export type Filter = {
	key: string;
	operation: QueryOperationString;
	value: string | number | boolean;
};
export type QueryOperationString =
	| "="
	| "!="
	| ">"
	| ">="
	| "<"
	| "<="
	| "LIKE"
	| "NOT_LIKE"
	| "INCLUDES"
	| "MATCH_REGEX"
	| "DOES_NOT_INCLUDE"
	| "EXISTS"
	| "DOES_NOT_EXIST"
	| "IN"
	| "NOT_IN"
	| "STARTS_WITH";

type BaseCalculationObject<TKey> = {
	operation:
		| "COUNT_DISTINCT"
		| "MAX"
		| "MIN"
		| "SUM"
		| "AVG"
		| "MEDIAN"
		| "P001"
		| "P01"
		| "P05"
		| "P10"
		| "P25"
		| "P75"
		| "P90"
		| "P95"
		| "P99"
		| "P999"
		| "STDDEV"
		| "VARIANCE";
	key: TKey;
	alias?: TKey;
};

type CountCalculation<TKey> = { operation: TKey extends "COUNT" ? TKey : string; alias?: TKey, key?: never };

export type QueryParameters = {
	datasets: string[];
	calculations?: string[];
	filterCombination?: "AND" | "OR";
	filters?: string[];
	groupBy?: {
		type: "string" | "number" | "boolean";
		value: string;
		orderBy?: string;
		limit?: number;
		order?: "ASC" | "DESC";
	};
	needle?: {
		value: string;
		isRegex?: boolean;
		matchCase?: boolean;
	};
};

import { F } from "ts-toolbelt";

export type QueryProps<TKey extends string> = {
	description?: string;
	parameters: QueryParameters<TKey>
	disableStackFilter?: boolean
};

export type QueryParameters <TKey extends string>= {
	datasets?: Datasets[];
	filterCombination?: "AND" | "OR";
	filters: Filter[];
	needle?: Needle;
	calculations?: never;
	groupBy?: never;
}
| {
	datasets?: Datasets[];
	filterCombination?: "AND" | "OR";
	filters: Filter[];
	needle?: Needle;
	calculations: Calculation<TKey>[];
	groupBy?: {
		type?: "string" | "number" | "boolean";
		value: string;
		// This doesn"t quite work yet. It should be a union of the key in the filters
		orderBy: F.NoInfer<TKey> | "COUNT";
		limit?: number;
		order?: "ASC" | "DESC";
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

export type Filter =
	| { key: Keys; operation: QueryOperationArray; value: string[] }
	| { key: Keys; operation: QueryOperationNull; value?: never }
	| {
			key: Keys;
			operation?: QueryOperationString;
			value: string | number | boolean;
	  };

type Keys =
	| string
	| "$baselime.acount"
	| "$baselime.baselimeId"
	| "$baselime.namespace"
	| "$baselime.region"
	| "$baselime.requestId"
	| "$baselime.service"
	| "$baselime.spanId"
	| "$baselime.traceId";

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
	| "STARTS_WITH";

export type QueryOperationArray = "IN" | "NOT_IN";

export type QueryOperationNull = "EXISTS" | "DOES_NOT_EXIST";

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

type CountCalculation<TKey> = {
	operation: TKey extends "COUNT" ? "COUNT" : string;
	alias?: TKey;
	key?: never;
};

export type DeploymentQueryParameters = {
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

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

export function count(alias?: string) {
    return { operation: "COUNT", alias } as const
}
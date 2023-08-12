

/**
 * Creates a filter operation object that narrows down the results where the key equals the value.
 *  @param {string} key The field in the data used for filtering.
 *  @param {string | number | boolean} value The value for the specified key used for filtering.
 *  @returns {Object} A filter operation object with the key, value, and operation properties.
 */
export function eq(key: string, value: string | number | boolean) {
	return { key, value, operation: "=" } as const;
}

/**
 * Creates a filter operation object that narrows down the results where the key does not equal the value.
 *  @param {string} key The field in the data used for filtering.
 *  @param {string | number | boolean} value The value for the specified key used for filtering.
 *  @returns {Object} A filter operation object with the key, value, and operation properties.
 */
export function neq(key: string, value: string | number | boolean) {
	return { key, value, operation: "!=" } as const;
}

/**
 * Creates a filter operation object that narrows down the results where the key is greater than the value.
 *  @param {string} key The field in the data used for filtering.
 *  @param {number} value The value for the specified key used for filtering.
 *  @returns {Object} A filter operation object with the key, value, and operation properties.
 */
export function gt(key: string, value: number) {
	return { key, value, operation: ">" } as const;
}

/**
 * Creates a filter operation object that narrows down the results where the key is greater than or equal to the value.
 *  @param {string} key The field in the data used for filtering.
 *  @param {number} value The value for the specified key used for filtering.
 *  @returns {Object} A filter operation object with the key, value, and operation properties.
 */
export function gte(key: string, value: number) {
	return { key, value, operation: ">=" } as const;
}

/**
 * Creates a filter operation object that narrows down the results where the key is less than the value.
 *  @param {string} key The field in the data used for filtering.
 *  @param {number} value The value for the specified key used for filtering.
 *  @returns {Object} A filter operation object with the key, value, and operation properties.
 */
export function lt(key: string, value: number) {
	return { key, value, operation: "<" } as const;
}

/**
 * Creates a filter operation object that narrows down the results where the key is less than or equal the value.
 *  @param {string} key The field in the data used for filtering.
 *  @param {number} value The value for the specified key used for filtering.
 *  @returns {Object} A filter operation object with the key, value, and operation properties.
 */
export function lte(key: string, value: number) {
	return { key, value, operation: "<=" } as const;
}

/**
 * Creates a filter operation object that narrows down the results where the key includes the value.
 *  @param {string} key The field in the data used for filtering.
 *  @param {string} value The value for the specified key used for filtering.
 *  @returns {Object} A filter operation object with the key, value, and operation properties.
 */
export function includes(key: string, value: string) {
	return { key, value, operation: "INCLUDES" } as const;
}

/**
 * Creates a filter operation object that narrows down the results where the key does not include the value.
 *  @param {string} key The field in the data used for filtering.
 *  @param {string} value The value for the specified key used for filtering.
 *  @returns {Object} A filter operation object with the key, value, and operation properties.
 */
export function notIncludes(key: string, value: string) {
	return { key, value, operation: "DOES_NOT_INCLUDE" } as const;
}

/**
 * Creates a filter operation object that narrows down the results where the key matches the regex.
 *  @param {string} key The field in the data used for filtering.
 *  @param {RegExp} value The value for the specified key used for filtering.
 *  @returns {Object} A filter operation object with the key, value, and operation properties.
 */
export function regex(key: string, value: RegExp) {
	return { key, value: value.source, operation: "MATCH_REGEX" } as const;
}

/**
 * Creates a filter operation object that narrows down the results where the key starts with the value.
 *  @param {string} key The field in the data used for filtering.
 *  @param {string} value The value for the specified key used for filtering.
 *  @returns {Object} A filter operation object with the key, value, and operation properties.
 */
export function startsWith(key: string, value: string) {
	return { key, value: value, operation: "STARTS_WITH" } as const;
}

/**
 * Creates a filter operation object that narrows down the results where the key is one of the values
 *  @param {string} key The field in the data used for filtering.
 *  @param {string[]} value The value for the specified key used for filtering.
 *  @returns {Object} A filter operation object with the key, value, and operation properties.
 */
export function inArray(key: string, value: string[]) {
	return { key, value: value, operation: "IN" } as const;
}

/**
 * Creates a filter operation object that narrows down the results where the key is not one of the values
 *  @param {string} key The field in the data used for filtering.
 *  @param {string[]} value The value for the specified key used for filtering.
 *  @returns {Object} A filter operation object with the key, value, and operation properties.
 */
export function notInArray(key: string, value: string[]) {
	return { key, value: value, operation: "NOT_IN" } as const;
}

/**
 * Creates a filter operation object that narrows down the results where the key exists
 *  @param {string} key The field in the data used for filtering.
 *  @returns {Object} A filter operation object with the key, value, and operation properties.
 */
export function exists(key: string) {
    return { key, operation: "EXISTS" } as const
}

/**
 * Creates a filter operation object that narrows down the results where the key does not exist
 *  @param {string} key The field in the data used for filtering.
 *  @returns {Object} A filter operation object with the key, value, and operation properties.
 */
export function notExists(key: string) {
    return { key, operation: "DOES_NOT_EXIST" } as const
}
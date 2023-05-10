

/**
 * Triggers alert where calculation result equals the value.
 *  @param {number} value The value used in the comparison
 *  @returns {Object} A threshold object
 */
export function eq(value: number) {
	return { value, operation: "=" } as const;
}

/**
 * Triggers alert where calculation result does not equal the value.
 *  @param {number} value The value used in the comparison
 *  @returns {Object} A threshold object
 */
export function neq(value: number) {
	return { value, operation: "!=" } as const;
}

/**
 * Triggers alert where calculation result is greater than the value.
 *  @param {number} value The value used in the comparison
 *  @returns {Object} A threshold object
 */
export function gt(value: number) {
	return { value, operation: ">" } as const;
}

/**
 * Triggers alert where calculation result is greater than or equal to the value.
 *  @param {number} value The value used in the comparison
 *  @returns {Object} A threshold object
 */
export function gte(value: number) {
	return { value, operation: ">=" } as const;
}

/**
 * Triggers alert where calculation result is less than the value.
 *  @param {number} value The value used in the comparison
 *  @returns {Object} A threshold object
 */
export function lt(value: number) {
	return { value, operation: "<" } as const;
}

/**
 * Triggers alert where calculation result is less than or equal to the value.
 *  @param {number} value The value used in the comparison
 *  @returns {Object} A threshold object
 */
export function lte(value: number) {
	return { value, operation: "<=" } as const;
}
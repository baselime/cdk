/**
 * Creates a calculation object that computes the count of all events
 *  @param {string} [alias] The temporary name to give to the results of the calculation
 *  @returns {Object} A calculation object with the operation, key, and alias properties.
 */
export function count(alias?: string) {
  return { operation: "COUNT", alias } as const
}

/**
 * Creates a calculation object that computes the count of distinct events
 *  @param {string} key The key to perform the calculation on
 *  @param {string} [alias] The temporary name to give to the results of the calculation
 *  @returns {Object} A calculation object with the operation, key, and alias properties.
 */
export function countDistinct(key: string, alias?: string) {
  return { operation: "COUNT_DISTINCT", key, alias } as const;
}

/**
 * Creates a calculation object that computes the maximum value of the provided key
 *  @param {string} key The key to perform the calculation on
 *  @param {string} [alias] The temporary name to give to the results of the calculation
 *  @returns {Object} A calculation object with the operation, key, and alias properties.
 */
export function max(key: string, alias?: string) {
  return { operation: "MAX", key, alias } as const;
}

/**
 * Creates a calculation object that computes the minimum value of the provided key
 *  @param {string} key The key to perform the calculation on
 *  @param {string} [alias] The temporary name to give to the results of the calculation
 *  @returns {Object} A calculation object with the operation, key, and alias properties.
 */
export function min(key: string, alias?: string) {
  return { operation: "MIN", key, alias } as const;
}

/**
 * Creates a calculation object that computes the sum of all values of the provided key
 *  @param {string} key The key to perform the calculation on
 *  @param {string} [alias] The temporary name to give to the results of the calculation
 *  @returns {Object} A calculation object with the operation, key, and alias properties.
 */
export function sum(key: string, alias?: string) {
  return { operation: "SUM", key, alias } as const;
}

/**
 * Creates a calculation object that computes the average value of the provided key
 *  @param {string} key The key to perform the calculation on
 *  @param {string} [alias] The temporary name to give to the results of the calculation
 *  @returns {Object} A calculation object with the operation, key, and alias properties.
 */
export function avg(key: string, alias?: string) {
  return { operation: "AVG", key, alias } as const;
}

/**
 * Creates a calculation object that computes the median value of the provided key
 *  @param {string} key The key to perform the calculation on
 *  @param {string} [alias] The temporary name to give to the results of the calculation
 *  @returns {Object} A calculation object with the operation, key, and alias properties.
 */
export function median(key: string, alias?: string) {
  return { operation: "MEDIAN", key, alias } as const;
}

/**
 * Creates a calculation object that computes the 0.1-th percentile of the provided key
 *  @param {string} key The key to perform the calculation on
 *  @param {string} [alias] The temporary name to give to the results of the calculation
 *  @returns {Object} A calculation object with the operation, key, and alias properties.
 */
export function p001(key: string, alias?: string) {
  return { operation: "P001", key, alias } as const;
}

/**
 * Creates a calculation object that computes the 1st percentile of the provided key
 *  @param {string} key The key to perform the calculation on
 *  @param {string} [alias] The temporary name to give to the results of the calculation
 *  @returns {Object} A calculation object with the operation, key, and alias properties.
 */
export function p01(key: string, alias?: string) {
  return { operation: "P01", key, alias } as const;
}

/**
 * Creates a calculation object that computes the 5th percentile of the provided key
 *  @param {string} key The key to perform the calculation on
 *  @param {string} [alias] The temporary name to give to the results of the calculation
 *  @returns {Object} A calculation object with the operation, key, and alias properties.
 */
export function p05(key: string, alias?: string) {
  return { operation: "P05", key, alias } as const;
}

/**
 * Creates a calculation object that computes the 10th percentile of the provided key
 *  @param {string} key The key to perform the calculation on
 *  @param {string} [alias] The temporary name to give to the results of the calculation
 *  @returns {Object} A calculation object with the operation, key, and alias properties.
 */
export function p10(key: string, alias?: string) {
  return { operation: "P10", key, alias } as const;
}

/**
 * Creates a calculation object that computes the 25th percentile of the provided key
 *  @param {string} key The key to perform the calculation on
 *  @param {string} [alias] The temporary name to give to the results of the calculation
 *  @returns {Object} A calculation object with the operation, key, and alias properties.
 */
export function p25(key: string, alias?: string) {
  return { operation: "P25", key, alias } as const;
}

/**
 * Creates a calculation object that computes the 75th percentile of the provided key
 *  @param {string} key The key to perform the calculation on
 *  @param {string} [alias] The temporary name to give to the results of the calculation
 *  @returns {Object} A calculation object with the operation, key, and alias properties.
 */
export function p75(key: string, alias?: string) {
  return { operation: "P75", key, alias } as const;
}

/**
 * Creates a calculation object that computes the 90th percentile of the provided key
 *  @param {string} key The key to perform the calculation on
 *  @param {string} [alias] The temporary name to give to the results of the calculation
 *  @returns {Object} A calculation object with the operation, key, and alias properties.
 */
export function p90(key: string, alias?: string) {
  return { operation: "P90", key, alias } as const;
}

/**
 * Creates a calculation object that computes the 95th percentile of the provided key
 *  @param {string} key The key to perform the calculation on
 *  @param {string} [alias] The temporary name to give to the results of the calculation
 *  @returns {Object} A calculation object with the operation, key, and alias properties.
 */
export function p95(key: string, alias?: string) {
  return { operation: "P95", key, alias } as const;
}

/**
 * Creates a calculation object that computes the 99th percentile of the provided key
 *  @param {string} key The key to perform the calculation on
 *  @param {string} [alias] The temporary name to give to the results of the calculation
 *  @returns {Object} A calculation object with the operation, key, and alias properties.
 */
export function p99(key: string, alias?: string) {
  return { operation: "P99", key, alias } as const;
}

/**
 * Creates a calculation object that computes the 99.9th percentile of the provided key
 *  @param {string} key The key to perform the calculation on
 *  @param {string} [alias] The temporary name to give to the results of the calculation
 *  @returns {Object} A calculation object with the operation, key, and alias properties.
 */
export function p999(key: string, alias?: string) {
  return { operation: "P999", key, alias } as const;
}

/**
 * Creates a calculation object that computes the standard deviation of the provided key
 *  @param {string} key The key to perform the calculation on
 *  @param {string} [alias] The temporary name to give to the results of the calculation
 *  @returns {Object} A calculation object with the operation, key, and alias properties.
 */
export function stdDev(key: string, alias?: string) {
  return { operation: "STDDEV", key, alias } as const;
}

/**
 * Creates a calculation object that computes the variance of the provided key
 *  @param {string} key The key to perform the calculation on
 *  @param {string} [alias] The temporary name to give to the results of the calculation
 *  @returns {Object} A calculation object with the operation, key, and alias properties.
 */
export function variance(key: string, alias?: string) {
  return { operation: "VARIANCE", key, alias } as const;
}

/**
 * Creates a needle object that narrows down the results by searching for the needle in the haystack of events.
 *  @param {string | RegExp} value The field in the data used for filtering.
 *  @param {Object} params Extra parameters for the search.
 *  @returns {Object} A needle object with the value, matchCase, and isRegex properties.
 */
export function search(value: string | RegExp, params?: { matchCase: boolean }) {
  return { value, isRegex: value instanceof RegExp, matchCase: params?.matchCase } as const;
}

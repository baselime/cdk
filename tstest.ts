type QueryParams =
  | {
      // Required field
      filter: Record<string, any>;
      // Optional fields
      groupBy?: never;
      calculations?: never;
    }
  | {
      // Required field
      filter: Record<string, any>;
      // Required fields if groupBy is present
      groupBy: string[];
      calculations: Record<string, any>;
    };

    // Valid: no groupBy or calculations
const queryParams1: QueryParams = {
    filter: {},
  };
  
  // Valid: with groupBy and calculations
  const queryParams2: QueryParams = {
    filter: {},
    groupBy: ["field1", "field2"],
    calculations: {
      count: "COUNT",
      sum: "SUM",
    },
  };
  
  // Invalid: with groupBy but no calculations
  const queryParams3: QueryParams = {
    filter: {},
    groupBy: ["field1", "field2"],
    // Error: Property 'calculations' is missing in type '{ filter: {}; groupBy: string[]; }'
  };
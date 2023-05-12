export function count(alias?: string) {
    return { operation: "COUNT", alias } as const
}

export function countDistinct(key: string, alias?: string) {
    return { operation: "COUNT_DISTINCT", key, alias } as const;
  }
  
  export function max(key: string, alias?: string) {
    return { operation: "MAX", key, alias } as const;
  }
  
  export function min(key: string, alias?: string) {
    return { operation: "MIN", key, alias } as const;
  }
  
  export function sum(key: string, alias?: string) {
    return { operation: "SUM", key, alias } as const;
  }
  
  export function avg(key: string, alias?: string) {
    return { operation: "AVG", key, alias } as const;
  }
  
  export function median(key: string, alias?: string) {
    return { operation: "MEDIAN", key, alias } as const;
  }
  
  export function p001(key: string, alias?: string) {
    return { operation: "P001", key, alias } as const;
  }
  
  export function p01(key: string, alias?: string) {
    return { operation: "P01", key, alias } as const;
  }
  
  export function p05(key: string, alias?: string) {
    return { operation: "P05", key, alias } as const;
  }
  
  export function p10(key: string, alias?: string) {
    return { operation: "P10", key, alias } as const;
  }
  
  export function p25(key: string, alias?: string) {
    return { operation: "P25", key, alias } as const;
  }
  
  export function p75(key: string, alias?: string) {
    return { operation: "P75", key, alias } as const;
  }
  
  export function p90(key: string, alias?: string) {
    return { operation: "P90", key, alias } as const;
  }
  
  export function p95(key: string, alias?: string) {
    return { operation: "P95", key, alias } as const;
  }
  
  export function p99(key: string, alias?: string) {
    return { operation: "P99", key, alias } as const;
  }
  
  export function p999(key: string, alias?: string) {
    return { operation: "P999", key, alias } as const;
  }
  
  export function stdDev(key: string, alias?: string) {
    return { operation: "STDDEV", key, alias } as const;
  }
  
  export function variance(key: string, alias?: string) {
    return { operation: "VARIANCE", key, alias } as const;
  }
enum Operator {
  AND = 'AND',
  OR = 'OR',
}

interface BuildSearchParams<K = Record<string, boolean>> {
  keys: K;
  value: any;
  operator?: Operator;
}

export { BuildSearchParams, Operator };

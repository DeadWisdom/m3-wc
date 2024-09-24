export type Rule<T> = (value: T, changes: Map<string, any>) => void;
export type RuleSet<T> = Record<string, Rule<T>>;

export function applyRules<T>(rules: RuleSet<T>, obj: T, changes: Map<string, any>) {
  for (let [key, rule] of Object.entries(rules)) {
    rule(obj, changes);
  }
}
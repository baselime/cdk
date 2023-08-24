import { Stack } from "aws-cdk-lib";
import { Baselime as Config } from "../config";

export function getServiceName(): string {
  const s = Config.getServiceName();
  if (s) {
    return s;
  }

  const construct = Config.getConstruct();
  const root = construct.node.root as any;

  const stage = root.stage;
  const name = root.name;

  if (stage && name) {
    return `${stage}-${name}`;
  }
  const stack = Stack.of(construct);
  return stack.stackName;
}

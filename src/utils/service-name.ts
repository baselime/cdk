import { Stack } from "aws-cdk-lib";
import { Baselime as Config } from "../config";

export function getServiceName(stack: Stack): string {
  const s = Config.getServiceName();
  if (s) {
    return s;
  }
  const tags = stack.tags.tagValues();

  const isSST = Object.keys(tags).some((el) => el.includes("sst"));

  if (isSST) {
    return `${tags['sst:stage']}-${tags['sst:app']}`;
  }

  return stack.stackName;
}

import { affirmingConsequentExample } from "./affirmingConsequent";
import { barcanExample } from "./barcan";
import { deDictoDeReExample } from "./deDictoDeRe";
import { distribNecessityExample } from "./distribNecessity";
import { necIdentityExample } from "./necIdentity";
import { necReflexivityExample } from "./necReflexivity";
import { socratesExample } from "./socrates";
import type { Example } from "./types";

export type { Example, ExampleStatement } from "./types";

export const ALL_EXAMPLES: Example[] = [
  socratesExample,
  affirmingConsequentExample,
  distribNecessityExample,
  necReflexivityExample,
  deDictoDeReExample,
  necIdentityExample,
  barcanExample,
];

export function findExampleById(id: string): Example | undefined {
  return ALL_EXAMPLES.find((ex) => ex.id === id);
}

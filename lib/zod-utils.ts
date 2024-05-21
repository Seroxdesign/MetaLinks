import { z } from "zod";

const NestedValueSchema = z.object({
  name: z.string(),
  type: z.string(),
  value: z.string(),
});

const AttestationElementSchema = z.object({
  name: z.literal("attestation"),
  signature: z.string(),
  type: z.string(),
  value: NestedValueSchema,
});

const TimeCreatedElementSchema = z.object({
  name: z.literal("timeCreated"),
  signature: z.string(),
  type: z.string(),
  value: NestedValueSchema,
});

const XPElementSchema = z.object({
  name: z.literal("xp"),
  signature: z.string(),
  type: z.string(),
  value: NestedValueSchema,
});

const AttestorElementSchema = z.object({
  name: z.literal("attester"),
  signature: z.string(),
  type: z.string(),
  value: z.string(),
});

export const ZAttestations = z.union([
  z.tuple([]),
  z.array(z.tuple([
    AttestationElementSchema,
    TimeCreatedElementSchema,
    XPElementSchema,
    AttestorElementSchema,
  ])),
]);


export type TAttestations = z.infer<typeof ZAttestations>
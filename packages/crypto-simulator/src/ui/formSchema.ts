import { z } from "zod";
import { fromDateInputValue, toDateInputValue } from "./format";

/** Highest amount accepted per contribution (a generous real-world ceiling). */
export const MAX_AMOUNT = 1_000_000_000;

/**
 * Validates the simulation form inputs. Each issue's `path` maps to a field so
 * the error can be shown floating next to that field (no layout shift).
 */
export const simulationSchema = z
  .object({
    coinId: z.string().min(1, "Choisissez un actif."),
    // z.number() rejects NaN (empty input) with its own message → override it
    // with a friendly French one instead of the raw "Expected number…".
    amount: z
      .number({ invalid_type_error: "Saisissez un montant." })
      .positive("Le montant doit être supérieur à 0.")
      .max(MAX_AMOUNT, "Montant trop élevé (max 1 000 000 000 €)."),
    frequency: z.enum(["once", "daily", "weekly", "monthly"]),
    from: z.string(),
    to: z.string(),
  })
  .refine((v) => Number.isFinite(fromDateInputValue(v.from)), {
    path: ["from"],
    message: "Date de début invalide.",
  })
  .refine((v) => Number.isFinite(fromDateInputValue(v.to)), {
    path: ["to"],
    message: "Date de fin invalide.",
  })
  // ISO "yyyy-mm-dd" strings compare chronologically; block anything past today.
  .refine((v) => v.from <= toDateInputValue(Date.now()), {
    path: ["from"],
    message: "La date ne peut pas dépasser aujourd'hui.",
  })
  .refine((v) => v.to <= toDateInputValue(Date.now()), {
    path: ["to"],
    message: "La date ne peut pas dépasser aujourd'hui.",
  })
  .refine((v) => fromDateInputValue(v.from) <= fromDateInputValue(v.to), {
    path: ["to"],
    message: "La date de fin doit suivre la date de début.",
  });

export type SimulationFormValues = z.infer<typeof simulationSchema>;

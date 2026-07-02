import { Controller, type Control, type FieldErrors } from "react-hook-form";
import { Field } from "./Field";
import { Select } from "./Select";
import { Combobox } from "./Combobox";
import { AmountInput } from "./AmountInput";
import { DateRangeField } from "./DateRangeField";
import { FREQUENCY_LABELS } from "./format";
import type { SimulationFormValues } from "./formSchema";
import { FREQUENCIES, isFrequency } from "../core/types";
import type { Coin } from "../data/contracts";

const CONTROL_ROW =
  "flex items-center gap-3 border-b border-blue-light/30 transition-colors focus-within:border-blue-sky";
const CONTROL =
  "w-full flex-1 border-0 bg-transparent py-2 text-[20px] font-light text-white outline-none [color-scheme:dark] placeholder:text-blue-light/60";
const UNIT = "shrink-0 whitespace-nowrap text-sm font-light text-blue-light";

interface SimulationFormProps {
  readonly control: Control<SimulationFormValues>;
  readonly errors: FieldErrors<SimulationFormValues>;
  readonly coins: readonly Coin[];
  readonly minDate?: string | undefined;
  readonly disabled: boolean;
}

export function SimulationForm({
  control,
  errors,
  coins,
  minDate,
  disabled,
}: SimulationFormProps) {
  const coinOptions = coins.map((coin) => ({
    value: coin.id,
    label: `${coin.name} (${coin.symbol.toUpperCase()})`,
  }));
  const frequencyOptions = FREQUENCIES.map((freq) => ({
    value: freq,
    label: FREQUENCY_LABELS[freq],
  }));

  return (
    <div aria-label="Paramètres de simulation">
      <Field
        label="Actif numérique"
        tooltip="La cryptomonnaie analysée (top 100 par capitalisation)."
        error={errors.coinId?.message}
      >
        <Controller
          name="coinId"
          control={control}
          render={({ field }) => (
            <Combobox
              value={field.value}
              options={coinOptions}
              onChange={field.onChange}
              ariaLabel="Actif numérique"
              placeholder="Choisir un actif"
              searchPlaceholder="Rechercher une crypto…"
              loading={disabled}
              disabled={disabled || coins.length === 0}
            />
          )}
        />
      </Field>

      <Field
        label="Montant"
        htmlFor="cs-amount"
        tooltip="Montant investi à chaque période."
        error={errors.amount?.message}
      >
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <div className={CONTROL_ROW}>
              <AmountInput
                id="cs-amount"
                className={CONTROL}
                value={field.value}
                onChange={field.onChange}
              />
              <span className={UNIT}>€</span>
            </div>
          )}
        />
      </Field>

      <Field label="Fréquence" tooltip="Versement unique, ou récurrent (DCA).">
        <Controller
          name="frequency"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              options={frequencyOptions}
              ariaLabel="Fréquence"
              onChange={(value) => {
                if (isFrequency(value)) field.onChange(value);
              }}
            />
          )}
        />
      </Field>

      <Field
        label="Période"
        tooltip="Début et fin de la période simulée."
        error={errors.from?.message ?? errors.to?.message}
      >
        <Controller
          name="from"
          control={control}
          render={({ field: fromField }) => (
            <Controller
              name="to"
              control={control}
              render={({ field: toField }) => (
                <DateRangeField
                  from={fromField.value}
                  to={toField.value}
                  minDate={minDate}
                  onFromChange={fromField.onChange}
                  onToChange={toField.onChange}
                  disabled={disabled}
                />
              )}
            />
          )}
        />
      </Field>
    </div>
  );
}

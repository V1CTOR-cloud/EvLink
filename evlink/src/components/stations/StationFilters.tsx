"use client";

import { RotateCcw, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { connectorTypeLabels } from "@/lib/session-utils";
import type { Connector } from "@/types";

export type StationAvailabilityFilter =
  | "all"
  | "available"
  | "unavailable";

export type StationFiltersState = {
  availability: StationAvailabilityFilter;
  connectorTypes: Connector["connector_type"][];
  minPower: number | null;
  maxPower: number | null;
  minPrice: number | null;
  maxPrice: number | null;
};

export type NumericRange = {
  min: number | null;
  max: number | null;
};

type StationFiltersProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: StationFiltersState;
  onFiltersChange: (filters: StationFiltersState) => void;
  connectorTypes: Connector["connector_type"][];
  powerRange: NumericRange;
  priceRange: NumericRange;
  activeFilterCount: number;
  canClear: boolean;
  onClear: () => void;
};

const availabilityOptions: {
  value: StationAvailabilityFilter;
  label: string;
}[] = [
  { value: "all", label: "Todas" },
  { value: "available", label: "Disponibles" },
  { value: "unavailable", label: "No disponibles" },
];

function parseNumberInput(value: string): number | null {
  if (value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function NumberRangeInputs({
  label,
  unit,
  valueMin,
  valueMax,
  bounds,
  invalid,
  disabled,
  onMinChange,
  onMaxChange,
}: {
  label: string;
  unit: string;
  valueMin: number | null;
  valueMax: number | null;
  bounds: NumericRange;
  invalid: boolean;
  disabled: boolean;
  onMinChange: (value: number | null) => void;
  onMaxChange: (value: number | null) => void;
}) {
  const minValue = bounds.min ?? undefined;
  const maxValue = bounds.max ?? undefined;

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">{label}</legend>
      <p className="text-xs text-muted-foreground">
        Valores disponibles:{" "}
        {bounds.min === null || bounds.max === null
          ? "sin datos"
          : `${bounds.min}–${bounds.max} ${unit}`}
      </p>
      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1 text-xs text-muted-foreground">
          <span>Mínimo ({unit})</span>
          <Input
            type="number"
            min={minValue}
            max={valueMax ?? maxValue}
            step="any"
            value={valueMin ?? ""}
            disabled={disabled}
            onChange={(event) => onMinChange(parseNumberInput(event.target.value))}
            aria-label={`${label}: valor mínimo en ${unit}`}
            aria-invalid={invalid}
          />
        </label>
        <label className="space-y-1 text-xs text-muted-foreground">
          <span>Máximo ({unit})</span>
          <Input
            type="number"
            min={valueMin ?? minValue}
            max={maxValue}
            step="any"
            value={valueMax ?? ""}
            disabled={disabled}
            onChange={(event) => onMaxChange(parseNumberInput(event.target.value))}
            aria-label={`${label}: valor máximo en ${unit}`}
            aria-invalid={invalid}
          />
        </label>
      </div>
      {invalid && (
        <p role="alert" className="text-xs text-destructive">
          El valor mínimo no puede ser superior al máximo.
        </p>
      )}
    </fieldset>
  );
}

export function StationFilters({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  connectorTypes,
  powerRange,
  priceRange,
  activeFilterCount,
  canClear,
  onClear,
}: StationFiltersProps) {
  const powerRangeInvalid =
    filters.minPower !== null &&
    filters.maxPower !== null &&
    filters.minPower > filters.maxPower;
  const priceRangeInvalid =
    filters.minPrice !== null &&
    filters.maxPrice !== null &&
    filters.minPrice > filters.maxPrice;

  function updateFilters(update: Partial<StationFiltersState>) {
    onFiltersChange({ ...filters, ...update });
  }

  function toggleConnectorType(type: Connector["connector_type"]) {
    const connectorTypes = filters.connectorTypes.includes(type)
      ? filters.connectorTypes.filter((selected) => selected !== type)
      : [...filters.connectorTypes, type];

    updateFilters({ connectorTypes });
  }

  return (
    <>
      <Button
        type="button"
        variant={activeFilterCount > 0 ? "secondary" : "outline"}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => onOpenChange(true)}
        className="h-10 gap-2"
      >
        <SlidersHorizontal className="size-4" />
        Filtros
        {activeFilterCount > 0 && (
          <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
            {activeFilterCount}
          </span>
        )}
      </Button>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[min(90dvh,44rem)] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Filtros de estaciones</DialogTitle>
            <DialogDescription>
              Los cambios se aplican al mapa y al listado.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">Disponibilidad</legend>
              <div className="flex flex-wrap gap-2">
                {availabilityOptions.map((option) => {
                  const selected = filters.availability === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() =>
                        updateFilters({ availability: option.value })
                      }
                      className={`min-h-10 rounded-full border px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                Una estación está disponible si tiene al menos un conector
                disponible.
              </p>
            </fieldset>

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">Tipo de conector</legend>
              {connectorTypes.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No hay conectores disponibles para filtrar por tipo.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {connectorTypes.map((type) => {
                    const checked = filters.connectorTypes.includes(type);

                    return (
                      <label
                        key={type}
                        className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-md border border-border px-2.5 text-xs transition-colors hover:bg-muted"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleConnectorType(type)}
                          className="size-3.5 accent-primary"
                        />
                        {connectorTypeLabels[type]}
                      </label>
                    );
                  })}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Se evalúan los conectores disponibles de cada estación.
              </p>
            </fieldset>

            <NumberRangeInputs
              label="Potencia"
              unit="kW"
              valueMin={filters.minPower}
              valueMax={filters.maxPower}
              bounds={powerRange}
              invalid={powerRangeInvalid}
              disabled={powerRange.min === null || powerRange.max === null}
              onMinChange={(minPower) => updateFilters({ minPower })}
              onMaxChange={(maxPower) => updateFilters({ maxPower })}
            />

            <NumberRangeInputs
              label="Precio"
              unit="€/kWh"
              valueMin={filters.minPrice}
              valueMax={filters.maxPrice}
              bounds={priceRange}
              invalid={priceRangeInvalid}
              disabled={priceRange.min === null || priceRange.max === null}
              onMinChange={(minPrice) => updateFilters({ minPrice })}
              onMaxChange={(maxPrice) => updateFilters({ maxPrice })}
            />
          </div>

          <div className="flex justify-end border-t border-border pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClear}
              disabled={!canClear}
            >
              <RotateCcw className="size-4" />
              Limpiar filtros
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/MultiSelect";
import React, { useMemo, useState } from "react";
import MetricCard from "./MetricCard";

interface PropertyData {
  id: number;
  commune: string;
  adresse: string;
  type: string;
  anneconstr: string;
  prixacquisitionchf: number | null;
  financementchf: number | null;
  financement: number | null;
  valeurcbrechf: number | null;
  loyerannuelsourcechf: number | null;
  loyerfutursourcechf: number | null;
  rendbrutsource: number | null;
  constructionrnovation: string | null;
  surfacelocm: number | null;
  vacance: number | null;
  loyeractuelchfancbre: number | null;
  loyerpotentielchfancbre: number | null;
  potentiel: number | null;
  rendbrut: string | null;
  rendnet: string | null;
  toiture: string | null;
  fentres: string | null;
  chauffagetypeanne: string | null;
  faade: string | null;
  notes: string | null;
  datevaluation: string | null;
  tauxdescomptenominal: number | null;
  tauxcapitalisationexit: number | null;
  inflation: number | null;
}

interface SimulationSectionProps {
  properties: PropertyData[];
  /** the entire portfolio’s original total value */
  originalTotalValue: number;
}

const calculateSimulatedValue = (
  property: PropertyData,
  rentalGrowth: number,
  exitCapRate: number
): number => {
  const currentRent = property.loyeractuelchfancbre ?? 0;
  const futureRent = currentRent * (1 + rentalGrowth / 100);
  if (exitCapRate <= 0) return 0;
  return futureRent / (exitCapRate / 100);
};

const SimulationSection: React.FC<SimulationSectionProps> = ({
  properties,
  originalTotalValue,
}) => {
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<string[]>([]);
  const [rentalGrowth, setRentalGrowth] = useState<string>("2");
  const [exitCapRate, setExitCapRate] = useState<string>("4");

  const selectedProperties = useMemo(
    () =>
      properties.filter((p) => selectedPropertyIds.includes(p.id.toString())),
    [properties, selectedPropertyIds]
  );

  const sumOriginalSelected = useMemo(
    () =>
      selectedProperties.reduce((sum, p) => sum + (p.valeurcbrechf ?? 0), 0),
    [selectedProperties]
  );

  const sumSimulatedSelected = useMemo(() => {
    const growth = parseFloat(rentalGrowth);
    const cap = parseFloat(exitCapRate);
    return selectedProperties.reduce((sum, prop) => {
      const sim = calculateSimulatedValue(prop, growth, cap);
      return sum + sim;
    }, 0);
  }, [selectedProperties, rentalGrowth, exitCapRate]);

  const totalValueChange = sumSimulatedSelected - sumOriginalSelected;
  const newPortfolioTotal = originalTotalValue + totalValueChange;

  return (
    <section className="bg-white rounded-lg shadow-md p-4 mb-8">
      <h2 className="text-xl font-semibold text-be_capital_dark_grey mb-4">
        Valuation Simulation
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <Label htmlFor="sim-properties">Select Properties</Label>
          <MultiSelect
            options={properties.map((p) => ({
              value: p.id.toString(),
              label: p.adresse,
            }))}
            selected={selectedPropertyIds}
            onChange={setSelectedPropertyIds}
            placeholder="Pick one or more…"
          />
        </div>

        <div>
          <Label htmlFor="sim-growth">Rental Growth (%)</Label>
          <Input
            id="sim-growth"
            type="number"
            value={rentalGrowth}
            onChange={(e) => setRentalGrowth(e.target.value)}
            placeholder="e.g., 2"
            step="0.1"
          />
        </div>

        <div>
          <Label htmlFor="sim-caprate">Exit Cap Rate (%)</Label>
          <Input
            id="sim-caprate"
            type="number"
            value={exitCapRate}
            onChange={(e) => setExitCapRate(e.target.value)}
            placeholder="e.g., 4"
            step="0.1"
          />
        </div>
      </div>

      {selectedProperties.length > 0 && (
        <>
          {/* Per‐property summaries */}
          <div className="space-y-6">
            {selectedProperties.map((prop) => {
              const growth = parseFloat(rentalGrowth);
              const cap = parseFloat(exitCapRate);
              const orig = prop.valeurcbrechf ?? 0;
              const sim = calculateSimulatedValue(prop, growth, cap);
              const diff = sim - orig;

              return (
                <div key={prop.id} className="bg-zinc-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-be_capital_dark_grey mb-2">
                    {prop.adresse}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <MetricCard
                      title="Original Value"
                      value={orig.toLocaleString("fr-CH", {
                        style: "currency",
                        currency: "CHF",
                      })}
                    />
                    <MetricCard
                      title="Simulated Value"
                      value={sim.toLocaleString("fr-CH", {
                        style: "currency",
                        currency: "CHF",
                      })}
                    />
                    <MetricCard
                      title="Value Change"
                      value={diff.toLocaleString("fr-CH", {
                        style: "currency",
                        currency: "CHF",
                      })}
                      textColor={diff >= 0 ? "text-green-600" : "text-red-600"}
                      borderColor={
                        diff >= 0 ? "border-green-500" : "border-red-500"
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Portfolio totals */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MetricCard
              title="Portfolio Original Total"
              value={originalTotalValue.toLocaleString("fr-CH", {
                style: "currency",
                currency: "CHF",
                maximumFractionDigits: 0,
              })}
              borderColor="border-gray-400"
              textColor="text-gray-600"
            />
            <MetricCard
              title="Portfolio New Total"
              value={newPortfolioTotal.toLocaleString("fr-CH", {
                style: "currency",
                currency: "CHF",
                maximumFractionDigits: 0,
              })}
            />
          </div>
        </>
      )}
    </section>
  );
};

export default SimulationSection;

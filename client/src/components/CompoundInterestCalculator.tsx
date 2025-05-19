import { useState } from "react";
import Header from "./Header";
import InputCard from "./InputCard";
import ResultsCard from "./ResultsCard";
import ChartCard from "./ChartCard";
import DetailsTable from "./DetailsTable";
import ActionButtons from "./ActionButtons";
import Footer from "./Footer";
import { calculateCompoundInterest } from "@/lib/calculator";

// Types
export type PeriodDetail = {
  period: number;
  interest: number;
  balance: number;
  returnPercentage: number;
};

export type CalculatorState = {
  initialCapital: number;
  periods: number;
  gainRate: number;
  riskRate: number;
  currency: string;
  calculationPerformed: boolean;
  verifiedPeriods: string[];
  periodDetails: PeriodDetail[];
  totalInterest: number;
  finalCapital: number;
};

// Default values
const defaultValues = {
  initialCapital: 5.00,
  periods: 20,
  gainRate: 100.00,
  riskRate: 25.00
};

export default function CompoundInterestCalculator() {
  // State
  const [state, setState] = useState<CalculatorState>({
    initialCapital: defaultValues.initialCapital,
    periods: defaultValues.periods,
    gainRate: defaultValues.gainRate,
    riskRate: defaultValues.riskRate,
    currency: 'EUR',
    calculationPerformed: false,
    verifiedPeriods: [],
    periodDetails: [],
    totalInterest: 0,
    finalCapital: 0
  });

  // Handlers
  const handleInputChange = (field: keyof typeof defaultValues, value: number) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const handleCurrencyChange = (currency: string) => {
    setState(prev => ({ ...prev, currency }));
  };

  const handleCalculate = () => {
    const result = calculateCompoundInterest(
      state.initialCapital,
      state.periods,
      state.gainRate,
      state.riskRate
    );

    if (result) {
      setState(prev => ({
        ...prev,
        calculationPerformed: true,
        totalInterest: result.totalInterest,
        finalCapital: result.finalCapital,
        periodDetails: result.periodDetails,
        verifiedPeriods: []
      }));
    }
  };

  const handleReset = () => {
    setState({
      initialCapital: defaultValues.initialCapital,
      periods: defaultValues.periods,
      gainRate: defaultValues.gainRate,
      riskRate: defaultValues.riskRate,
      currency: 'EUR',
      calculationPerformed: false,
      verifiedPeriods: [],
      periodDetails: [],
      totalInterest: 0,
      finalCapital: 0
    });
  };

  const handleToggleVerification = (period: string) => {
    setState(prev => {
      const verifiedPeriods = prev.verifiedPeriods.includes(period)
        ? prev.verifiedPeriods.filter(p => p !== period)
        : [...prev.verifiedPeriods, period];
      return { ...prev, verifiedPeriods };
    });
  };

  return (
    <div id="app">
      <Header />
      
      <main className="container mx-auto px-4" id="calculator-container">
        <InputCard 
          initialCapital={state.initialCapital}
          periods={state.periods}
          gainRate={state.gainRate}
          riskRate={state.riskRate}
          currency={state.currency}
          onInputChange={handleInputChange}
          onCurrencyChange={handleCurrencyChange}
          onCalculate={handleCalculate}
        />

        {state.calculationPerformed && (
          <>
            <ResultsCard 
              calculationPerformed={state.calculationPerformed}
              totalInterest={state.totalInterest}
              finalCapital={state.finalCapital}
              currency={state.currency}
            />

            <ChartCard 
              periodDetails={state.periodDetails}
              verifiedPeriods={state.verifiedPeriods}
              currency={state.currency}
            />

            <DetailsTable 
              periodDetails={state.periodDetails}
              verifiedPeriods={state.verifiedPeriods}
              currency={state.currency}
              onToggleVerification={handleToggleVerification}
              calculationPerformed={state.calculationPerformed}
            />

            <ActionButtons 
              onReset={handleReset}
              calculatorState={state}
            />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

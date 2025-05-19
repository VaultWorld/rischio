import { formatCurrency } from "@/lib/formatter";

interface ResultsCardProps {
  calculationPerformed: boolean;
  totalInterest: number;
  finalCapital: number;
  currency: string;
}

export default function ResultsCard({
  calculationPerformed,
  totalInterest,
  finalCapital,
  currency
}: ResultsCardProps) {
  return (
    <div className="bg-card-color rounded-3xl border border-border-color p-6 mb-6 shadow-lg animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="text-center p-4">
          <h3 className="text-text-muted mb-2 text-lg">Interesse totale</h3>
          <p id="totalInterest" className="text-4xl font-bold text-success-color tracking-wide">
            {calculationPerformed 
              ? formatCurrency(totalInterest, currency) 
              : formatCurrency(0, currency)}
          </p>
        </div>
        
        <div className="text-center p-4">
          <h3 className="text-text-muted mb-2 text-lg">Capitale Finale</h3>
          <p id="finalCapital" className="text-4xl font-bold text-success-color tracking-wide">
            {calculationPerformed 
              ? formatCurrency(finalCapital, currency) 
              : formatCurrency(0, currency)}
          </p>
        </div>
      </div>
    </div>
  );
}

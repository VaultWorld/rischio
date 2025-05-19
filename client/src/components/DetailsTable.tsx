import { PeriodDetail } from './CompoundInterestCalculator';
import { formatCurrency, formatPercentage } from '@/lib/formatter';

interface DetailsTableProps {
  periodDetails: PeriodDetail[];
  verifiedPeriods: string[];
  currency: string;
  onToggleVerification: (period: string) => void;
  calculationPerformed: boolean;
}

export default function DetailsTable({ 
  periodDetails, 
  verifiedPeriods, 
  currency, 
  onToggleVerification,
  calculationPerformed
}: DetailsTableProps) {
  const currencySymbol = {
    'EUR': '€',
    'USD': '$',
    'BTC': '₿',
    'USDT': '₮'
  }[currency] || '€';

  return (
    <div className="bg-card-color rounded-3xl border border-border-color p-6 mb-6 shadow-lg animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Dettaglio periodo per periodo</h2>
      <div className="table-container">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="bg-[#27262C] p-3 text-left font-semibold text-text-muted rounded-tl-xl">#</th>
              <th className="bg-[#27262C] p-3 text-left font-semibold text-text-muted">Interesse ({currencySymbol})</th>
              <th className="bg-[#27262C] p-3 text-left font-semibold text-text-muted">Bilancio ({currencySymbol})</th>
              <th className="bg-[#27262C] p-3 text-left font-semibold text-text-muted">Rendimento</th>
              <th className="bg-[#27262C] p-3 text-left font-semibold text-text-muted rounded-tr-xl">Verifica</th>
            </tr>
          </thead>
          <tbody id="resultsTableBody">
            {calculationPerformed && periodDetails.length > 0 ? (
              periodDetails.map((detail, index) => (
                <tr 
                  key={detail.period} 
                  className="table-row hover:bg-white/5" 
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <td className="p-3 border-b border-border-color">{detail.period}</td>
                  <td className="p-3 border-b border-border-color text-success-color font-semibold">
                    {formatCurrency(detail.interest, currency)}
                  </td>
                  <td className="p-3 border-b border-border-color">
                    {formatCurrency(detail.balance, currency)}
                  </td>
                  <td className="p-3 border-b border-border-color text-success-color font-semibold">
                    {formatPercentage(detail.returnPercentage)}
                  </td>
                  <td className="p-3 border-b border-border-color">
                    <svg 
                      className={`check-icon w-6 h-6 cursor-pointer ${!verifiedPeriods.includes(detail.period.toString()) ? 'inactive' : ''}`}
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="#31D0AA" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      onClick={() => onToggleVerification(detail.period.toString())}
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-3 text-center text-text-muted">
                  Calcola l'interesse per visualizzare i dettagli
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

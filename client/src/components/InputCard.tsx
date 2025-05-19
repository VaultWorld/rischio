import { ChangeEvent } from "react";

interface InputCardProps {
  initialCapital: number;
  periods: number;
  gainRate: number;
  riskRate: number;
  currency: string;
  onInputChange: (field: string, value: number) => void;
  onCurrencyChange: (currency: string) => void;
  onCalculate: () => void;
}

export default function InputCard({
  initialCapital,
  periods,
  gainRate,
  riskRate,
  currency,
  onInputChange,
  onCurrencyChange,
  onCalculate
}: InputCardProps) {
  const handleInputChange = (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      onInputChange(field, value);
    }
  };

  const handleCurrencyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onCurrencyChange(e.target.value);
  };

  const currencySymbols: Record<string, string> = {
    'EUR': '€',
    'USD': '$',
    'BTC': '₿',
    'USDT': '₮'
  };

  return (
    <div className="bg-card-color rounded-3xl border border-border-color p-6 mb-6 shadow-lg animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Inserisci i dati</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Initial Capital */}
        <div className="mb-4">
          <label htmlFor="initialCapital" className="block mb-2 font-medium">Capitale iniziale</label>
          <div className="relative">
            <span className="absolute top-1/2 left-4 transform -translate-y-1/2 text-text-muted pointer-events-none">
              {currencySymbols[currency]}
            </span>
            <input 
              type="number" 
              id="initialCapital" 
              value={initialCapital} 
              min="0.01" 
              step="0.01"
              onChange={handleInputChange('initialCapital')}
              className="w-full py-3 pl-8 pr-4 bg-[#27262C] text-text-color border border-border-color rounded-2xl text-base focus:border-primary-color focus:outline-none focus:ring-2 focus:ring-primary-color/20 transition"
            />
          </div>
        </div>
        
        {/* Currency */}
        <div className="mb-4">
          <label htmlFor="currencySelect" className="block mb-2 font-medium">Valuta</label>
          <select 
            id="currencySelect" 
            value={currency}
            onChange={handleCurrencyChange}
            className="w-full py-3 px-4 bg-[#27262C] text-text-color border border-border-color rounded-2xl text-base focus:border-primary-color focus:outline-none focus:ring-2 focus:ring-primary-color/20 transition cursor-pointer"
          >
            <option value="EUR">EUR (€)</option>
            <option value="USD">USD ($)</option>
            <option value="BTC">BTC (₿)</option>
            <option value="USDT">USDT (₮)</option>
          </select>
        </div>
        
        {/* Number of Periods */}
        <div className="mb-4">
          <label htmlFor="periods" className="block mb-2 font-medium">Numero di volte (Trade)</label>
          <input 
            type="number" 
            id="periods" 
            value={periods} 
            min="1" 
            max="100" 
            step="1"
            onChange={handleInputChange('periods')}
            className="w-full py-3 px-4 bg-[#27262C] text-text-color border border-border-color rounded-2xl text-base focus:border-primary-color focus:outline-none focus:ring-2 focus:ring-primary-color/20 transition"
          />
        </div>
        
        {/* Gain Rate */}
        <div className="mb-4">
          <label htmlFor="gainRate" className="block mb-2 font-medium">Tasso di guadagno (%)</label>
          <input 
            type="number" 
            id="gainRate" 
            value={gainRate} 
            min="0.01" 
            step="0.01"
            onChange={handleInputChange('gainRate')}
            className="w-full py-3 px-4 bg-[#27262C] text-text-color border border-border-color rounded-2xl text-base focus:border-primary-color focus:outline-none focus:ring-2 focus:ring-primary-color/20 transition"
          />
        </div>
        
        {/* Risk Rate with Calculate Button */}
        <div className="mb-4 md:col-span-2">
          <label htmlFor="riskRate" className="block mb-2 font-medium">Tasso di rischio capitale (%)</label>
          <div className="flex items-center gap-3">
            <input 
              type="number" 
              id="riskRate" 
              value={riskRate} 
              min="0.01" 
              step="0.01"
              onChange={handleInputChange('riskRate')}
              className="flex-1 py-3 px-4 bg-[#27262C] text-text-color border border-border-color rounded-2xl text-base focus:border-primary-color focus:outline-none focus:ring-2 focus:ring-primary-color/20 transition"
            />
            <button 
              onClick={onCalculate}
              className="bg-success-color text-[#27262C] border-none rounded-2xl py-3 px-6 text-base font-semibold cursor-pointer flex items-center transition hover:bg-[#2BB096] active:scale-[0.97] whitespace-nowrap"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 5L5 19M5 5l14 14"></path>
              </svg>
              Calcola
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

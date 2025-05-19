import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { CalculatorState } from './CompoundInterestCalculator';

interface ActionButtonsProps {
  onReset: () => void;
  calculatorState: CalculatorState;
}

export default function ActionButtons({ onReset, calculatorState }: ActionButtonsProps) {
  const downloadAsImage = async () => {
    const container = document.getElementById('calculator-container');
    
    if (container) {
      const originalBg = container.style.backgroundColor;
      const originalColor = container.style.color;
      
      // Set styles for better image capture
      container.style.backgroundColor = '#191326';
      container.style.color = '#FFFFFF';
      
      try {
        const canvas = await html2canvas(container, {
          backgroundColor: '#191326',
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          scrollX: 0,
          scrollY: 0
        });
        
        // Create download link
        const link = document.createElement('a');
        link.download = `calcolatrice-interesse-${calculatorState.currency.toLowerCase()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        console.error("Error creating image:", error);
        alert("Si è verificato un errore durante il download dell'immagine. Riprova.");
      } finally {
        // Reset styles
        container.style.backgroundColor = originalBg;
        container.style.color = originalColor;
      }
    }
  };

  const shareResults = () => {
    if (calculatorState.calculationPerformed) {
      const shareText = `Ho calcolato un guadagno di ${
        calculatorState.finalCapital.toFixed(2)
      } ${calculatorState.currency} con il calcolatore di interesse composto!`;
      
      if (navigator.share) {
        navigator.share({
          title: 'Calcolatore dell\'Interesse Composto',
          text: shareText,
          url: window.location.href,
        }).catch((error) => console.log('Error sharing', error));
      } else {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText + ' ' + window.location.href)
          .then(() => {
            alert('Testo copiato negli appunti: ' + shareText);
          })
          .catch(err => {
            console.error('Errore nella copia:', err);
          });
      }
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 my-8">
      <button 
        onClick={downloadAsImage}
        className="bg-primary-color text-[#27262C] border-none rounded-2xl py-3 px-6 text-base font-semibold cursor-pointer flex items-center transition hover:bg-[#1AB4C0] active:scale-[0.97]"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
        </svg>
        Scarica come Immagine
      </button>
      
      <button 
        onClick={shareResults}
        className="bg-secondary-color text-white border-none rounded-2xl py-3 px-6 text-base font-semibold cursor-pointer flex items-center transition hover:bg-[#6133C8] active:scale-[0.97]"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
        </svg>
        Condividi
      </button>
      
      <button 
        onClick={onReset}
        className="bg-warning-color text-[#27262C] border-none rounded-2xl py-3 px-6 text-base font-semibold cursor-pointer flex items-center transition hover:bg-[#F2A93B] active:scale-[0.97]"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        Ripristina
      </button>
    </div>
  );
}

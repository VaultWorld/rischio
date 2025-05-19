// Elementi DOM
const initialCapitalInput = document.getElementById('initialCapital');
const periodsInput = document.getElementById('periods');
const gainRateInput = document.getElementById('gainRate');
const riskRateInput = document.getElementById('riskRate');
const totalInterestElement = document.getElementById('totalInterest');
const finalCapitalElement = document.getElementById('finalCapital');
const resultsTableBody = document.getElementById('resultsTableBody');
const downloadButton = document.getElementById('downloadButton');
const shareButton = document.getElementById('shareButton');
const resetButton = document.getElementById('resetButton');
const calculateButton = document.getElementById('calculateButton');
const currencySelect = document.getElementById('currencySelect');
const currencySymbol = document.getElementById('currencySymbol');

// Valori iniziali per il ripristino
const defaultValues = {
  initialCapital: '5.00',
  periods: '20',
  gainRate: '100.00',
  riskRate: '25.00'
};

// Stato dell'applicazione
let calculationPerformed = false; // Indica se il calcolo è stato eseguito
let verifiedPeriods = []; // Array dei periodi verificati con la spunta

// Riferimento per il grafico
let growthChart = null;

// Mappatura dei simboli di valuta
const currencySymbols = {
  'EUR': '€',
  'USD': '$',
  'BTC': '₿',
  'USDT': '₮'
};

// Funzione per ottenere la valuta corrente
function getCurrentCurrency() {
  return currencySelect ? currencySelect.value : 'EUR';
}

// Funzione per ottenere il simbolo di valuta corrente
function getCurrentCurrencySymbol() {
  return currencySymbols[getCurrentCurrency()] || '€';
}

// Funzioni di formattazione
function formatCurrency(value) {
  const currency = getCurrentCurrency();
  
  // Usiamo formattazioni diverse in base alla valuta
  if (currency === 'BTC') {
    // Per Bitcoin formatta con 8 decimali
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'XBT',
      minimumFractionDigits: 8,
      maximumFractionDigits: 8
    }).format(value).replace('XBT', '₿');
  } else if (currency === 'USDT') {
    // Per USDT usiamo il simbolo ₮
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value).replace('$', '₮');
  } else {
    // Per altre valute (EUR, USD) usiamo la formattazione standard
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: currency
    }).format(value);
  }
}

function formatPercentage(value) {
  return new Intl.NumberFormat('it-IT', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);
}

// Funzione per calcolare l'interesse composto
function calculateCompoundInterest() {
  // Ottieni i valori dagli input
  const initialCapital = parseFloat(initialCapitalInput.value);
  const periods = parseInt(periodsInput.value);
  const gainRate = parseFloat(gainRateInput.value);
  const riskRate = parseFloat(riskRateInput.value);
  
  // Verifica che i valori siano validi
  if (isNaN(initialCapital) || isNaN(periods) || isNaN(gainRate) || isNaN(riskRate)) {
    return;
  }
  
  // Converti le percentuali in decimali
  const riskRateDecimal = riskRate / 100;
  
  // Array per i dettagli di ogni periodo
  const periodDetails = [];
  
  // Calcolo dell'interesse composto
  let currentBalance = initialCapital;
  
  for (let period = 1; period <= periods; period++) {
    // Calcola l'interesse per questo periodo in base al tasso di rischio
    const interest = currentBalance * riskRateDecimal;
    
    // Aggiorna il bilancio
    const newBalance = currentBalance + interest;
    
    // Calcola la percentuale di rendimento
    const returnPercentage = ((newBalance - initialCapital) / initialCapital) * 100;
    
    // Memorizza i dettagli del periodo
    periodDetails.push({
      period,
      interest,
      balance: newBalance,
      returnPercentage
    });
    
    // Aggiorna il bilancio corrente per il periodo successivo
    currentBalance = newBalance;
  }
  
  // Calcola l'interesse totale e il capitale finale
  const totalInterest = currentBalance - initialCapital;
  const finalCapital = currentBalance;
  
  return {
    totalInterest,
    finalCapital,
    periodDetails
  };
}

// Funzione per aggiornare l'interfaccia utente con i risultati
function updateUI(results) {
  if (!results) return;
  
  // Aggiorna i totali solo se è stato premuto il pulsante calcola
  if (calculationPerformed) {
    totalInterestElement.textContent = formatCurrency(results.totalInterest);
    finalCapitalElement.textContent = formatCurrency(results.finalCapital);
    
    // Aggiorna la tabella dei risultati
    resultsTableBody.innerHTML = '';
    results.periodDetails.forEach(detail => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${detail.period}</td>
        <td class="highlight-value">${formatCurrency(detail.interest)}</td>
        <td>${formatCurrency(detail.balance)}</td>
        <td class="highlight-value">${formatPercentage(detail.returnPercentage)}</td>
        <td>
          <svg class="check-icon" viewBox="0 0 24 24" data-period="${detail.period}" onclick="toggleVerification(this)">
            <path d="M5 13l4 4L19 7"></path>
          </svg>
        </td>
      `;
      // Aggiungi l'animazione con un ritardo basato sul periodo
      row.style.animationDelay = `${detail.period * 0.05}s`;
      resultsTableBody.appendChild(row);
    });
    
    // Aggiorna il grafico solo con i dati verificati (se ce ne sono)
    if (verifiedPeriods.length > 0) {
      updateChartWithVerifiedData(results.periodDetails);
    } else {
      // Se non ci sono periodi verificati, mostriamo un grafico vuoto
      clearChart();
    }
  } else {
    // Se il calcolo non è stato ancora eseguito, mostriamo placeholders
    totalInterestElement.textContent = "€ 0,00";
    finalCapitalElement.textContent = "€ 0,00";
    resultsTableBody.innerHTML = '';
    clearChart();
  }
}

// Funzione per pulire il grafico
function clearChart() {
  if (growthChart) {
    growthChart.destroy();
  }
  
  // Ottieni il contesto del canvas
  const ctx = document.getElementById('growthChart').getContext('2d');
  
  // Crea un grafico vuoto
  growthChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Bilancio',
          data: [],
          backgroundColor: 'rgba(31, 199, 212, 0.2)',
          borderColor: 'rgba(31, 199, 212, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Interesse per Periodo',
          data: [],
          backgroundColor: 'rgba(49, 208, 170, 0.2)',
          borderColor: 'rgba(49, 208, 170, 1)',
          borderWidth: 2,
          tension: 0.4,
        }
      ]
    },
    options: getChartOptions()
  });
}

// Funzione per aggiornare il grafico solo con i dati verificati
function updateChartWithVerifiedData(periodDetails) {
  if (growthChart) {
    growthChart.destroy();
  }
  
  // Filtra i dati solo per i periodi verificati
  const filteredDetails = periodDetails.filter(detail => 
    verifiedPeriods.includes(detail.period.toString())
  );
  
  // Se non ci sono dati verificati, mostra un grafico vuoto
  if (filteredDetails.length === 0) {
    clearChart();
    return;
  }
  
  // Prepara i dati per il grafico
  const labels = filteredDetails.map(detail => `Trade ${detail.period}`);
  const balanceData = filteredDetails.map(detail => detail.balance);
  const interestData = filteredDetails.map(detail => detail.interest);
  
  // Ottieni il contesto del canvas
  const ctx = document.getElementById('growthChart').getContext('2d');
  
  // Crea il nuovo grafico
  growthChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Bilancio',
          data: balanceData,
          backgroundColor: 'rgba(31, 199, 212, 0.2)',
          borderColor: 'rgba(31, 199, 212, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Interesse per Periodo',
          data: interestData,
          backgroundColor: 'rgba(49, 208, 170, 0.2)',
          borderColor: 'rgba(49, 208, 170, 1)',
          borderWidth: 2,
          tension: 0.4,
        }
      ]
    },
    options: getChartOptions()
  });
}

// Funzione per ottenere le opzioni di configurazione del grafico
function getChartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#FFFFFF',
          font: {
            family: 'Kanit',
            size: 12
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(39, 38, 44, 0.9)',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: '#383241',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#7A6EAA',
          font: {
            family: 'Kanit'
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#7A6EAA',
          font: {
            family: 'Kanit'
          },
          callback: function(value) {
            return formatCurrency(value);
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    }
  };
}

// Funzione per scaricare la calcolatrice come immagine
function downloadAsImage() {
  const container = document.getElementById('calculator-container');
  
  // Imposta uno sfondo esplicito per garantire che tutto sia visibile nell'immagine
  const originalBg = container.style.backgroundColor;
  const originalColor = container.style.color;
  
  // Salva lo stile originale e imposta lo sfondo per l'acquisizione
  container.style.backgroundColor = '#191326';
  container.style.color = '#FFFFFF';
  
  // Opzioni per html2canvas per migliorare la qualità dell'immagine
  const options = {
    backgroundColor: '#191326',  // Il colore di sfondo PancakeSwap
    scale: 2,                   // Scala x2 per migliore qualità
    useCORS: true,              // Permette di acquisire immagini cross-origin
    allowTaint: true,           // Permette di acquisire elementi "tainted"
    logging: false,             // Disattiva logging per migliorare prestazioni
    scrollX: 0,                 // Previene problemi di scroll
    scrollY: 0                  // Previene problemi di scroll
  };
  
  // Usa html2canvas con le opzioni migliorate
  html2canvas(container, options).then(canvas => {
    try {
      // Crea un link per il download
      const link = document.createElement('a');
      link.download = `calcolatrice-interesse-${getCurrentCurrency().toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error("Errore nel download dell'immagine:", error);
      alert("Si è verificato un errore durante il download dell'immagine. Riprova.");
    } finally {
      // Ripristina lo stile originale
      container.style.backgroundColor = originalBg;
      container.style.color = originalColor;
    }
  }).catch(error => {
    console.error("Errore nella creazione del canvas:", error);
    alert("Si è verificato un errore durante la preparazione dell'immagine. Riprova.");
    
    // Ripristina lo stile anche in caso di errore
    container.style.backgroundColor = originalBg;
    container.style.color = originalColor;
  });
}

// Funzione per rendere cliccabili le spunte di verifica
function toggleVerification(element) {
  const period = element.getAttribute('data-period');
  
  // Cambia l'opacità per mostrare lo stato di verifica
  if (element.style.opacity === '0.3') {
    // Riattiva la spunta
    element.style.opacity = '1';
    
    // Aggiungi il periodo all'array dei periodi verificati
    if (!verifiedPeriods.includes(period)) {
      verifiedPeriods.push(period);
    }
  } else {
    // Disattiva la spunta
    element.style.opacity = '0.3';
    
    // Rimuovi il periodo dall'array dei periodi verificati
    const index = verifiedPeriods.indexOf(period);
    if (index !== -1) {
      verifiedPeriods.splice(index, 1);
    }
  }
  
  // Aggiunge un piccolo effetto visivo
  element.classList.add('bounce');
  setTimeout(() => {
    element.classList.remove('bounce');
  }, 300);
  
  // Aggiorna il grafico con i nuovi dati verificati
  const results = calculateCompoundInterest();
  if (results) {
    updateChartWithVerifiedData(results.periodDetails);
  }
}

// Funzione per ripristinare i valori predefiniti
function resetCalculator() {
  initialCapitalInput.value = defaultValues.initialCapital;
  periodsInput.value = defaultValues.periods;
  gainRateInput.value = defaultValues.gainRate;
  riskRateInput.value = defaultValues.riskRate;
  
  // Reimposta lo stato dell'applicazione
  calculationPerformed = false;
  verifiedPeriods = [];
  
  // Aggiorna l'interfaccia senza calcoli
  const results = calculateCompoundInterest();
  updateUI(results);
}

// Funzione per condividere il calcolo
function shareCalculation() {
  // Prepara i parametri URL per la condivisione
  const params = new URLSearchParams({
    capital: initialCapitalInput.value,
    periods: periodsInput.value,
    gainRate: gainRateInput.value,
    riskRate: riskRateInput.value
  });
  
  // Crea l'URL con i parametri
  const shareURL = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  
  // Verifica se l'API di condivisione è disponibile
  if (navigator.share) {
    navigator.share({
      title: 'Calcolatore dell\'Interesse Composto',
      text: 'Guarda questa simulazione di interesse composto!',
      url: shareURL
    })
    .catch(error => {
      // Fallback se la condivisione fallisce
      copyToClipboard(shareURL);
    });
  } else {
    // Fallback per browser che non supportano l'API Share
    copyToClipboard(shareURL);
  }
}

// Funzione per copiare l'URL negli appunti
function copyToClipboard(text) {
  // Crea un elemento temporaneo
  const input = document.createElement('input');
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
  
  // Notifica all'utente
  alert('Link copiato negli appunti!');
}

// Funzione per controllare i parametri URL all'avvio
function checkURLParams() {
  const params = new URLSearchParams(window.location.search);
  
  // Imposta i valori dai parametri se presenti
  if (params.has('capital')) initialCapitalInput.value = params.get('capital');
  if (params.has('periods')) periodsInput.value = params.get('periods');
  if (params.has('gainRate')) gainRateInput.value = params.get('gainRate');
  if (params.has('riskRate')) riskRateInput.value = params.get('riskRate');
  
  // Calcola e aggiorna l'interfaccia
  if (params.size > 0) {
    const results = calculateCompoundInterest();
    updateUI(results);
  }
}

// Listener per l'input (ma senza calcolo automatico)
initialCapitalInput.addEventListener('input', () => {
  if (calculationPerformed) {
    // Reimposta lo stato per richiedere un nuovo calcolo esplicito
    calculationPerformed = false;
  }
});

periodsInput.addEventListener('input', () => {
  if (calculationPerformed) {
    // Reimposta lo stato per richiedere un nuovo calcolo esplicito
    calculationPerformed = false;
  }
});

gainRateInput.addEventListener('input', () => {
  if (calculationPerformed) {
    // Reimposta lo stato per richiedere un nuovo calcolo esplicito
    calculationPerformed = false;
  }
});

riskRateInput.addEventListener('input', () => {
  if (calculationPerformed) {
    // Reimposta lo stato per richiedere un nuovo calcolo esplicito
    calculationPerformed = false;
  }
});

// Listener per i pulsanti
downloadButton.addEventListener('click', downloadAsImage);
shareButton.addEventListener('click', shareCalculation);
resetButton.addEventListener('click', resetCalculator);

// Pulsante Calcola - attiva il calcolo esplicito
calculateButton.addEventListener('click', () => {
  // Imposta lo stato di calcolo eseguito
  calculationPerformed = true;
  
  // Resetta le verifiche precedenti
  verifiedPeriods = [];
  
  // Calcola e aggiorna l'interfaccia
  const results = calculateCompoundInterest();
  updateUI(results);
});

// Stile per l'icona di verifica
const style = document.createElement('style');
style.textContent = `
  .check-icon {
    width: 1.5rem;
    height: 1.5rem;
    fill: none;
    stroke: #31D0AA;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    cursor: pointer;
    transition: transform 0.2s, opacity 0.2s;
  }
  
  .check-icon:hover {
    transform: scale(1.2);
  }
  
  .bounce {
    animation: bounceEffect 0.3s ease;
  }
  
  @keyframes bounceEffect {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.3); }
  }
`;
document.head.appendChild(style);

// Funzione per aggiornare il simbolo visualizzato in base alla valuta selezionata
function updateCurrencySymbol() {
  if (currencySymbol) {
    currencySymbol.textContent = getCurrentCurrencySymbol();
  }
}

// Event listener per il cambio di valuta
currencySelect.addEventListener('change', () => {
  // Aggiorna il simbolo visualizzato
  updateCurrencySymbol();
  
  // Se è stato eseguito un calcolo, aggiorna i risultati con la nuova valuta
  if (calculationPerformed) {
    const results = calculateCompoundInterest();
    updateUI(results);
  }
});

// Calcola e visualizza i risultati iniziali
document.addEventListener('DOMContentLoaded', () => {
  // Inizializza il simbolo di valuta
  updateCurrencySymbol();
  
  // Controlla i parametri URL per i valori condivisi
  checkURLParams();
  
  // Se non ci sono parametri URL, calcola con i valori predefiniti
  if (new URLSearchParams(window.location.search).size === 0) {
    const results = calculateCompoundInterest();
    updateUI(results);
  }
});
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { PeriodDetail } from './CompoundInterestCalculator';
import { formatCurrency } from '@/lib/formatter';

interface ChartCardProps {
  periodDetails: PeriodDetail[];
  verifiedPeriods: string[];
  currency: string;
}

export default function ChartCard({ periodDetails, verifiedPeriods, currency }: ChartCardProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      
      if (ctx) {
        // Destroy existing chart if it exists
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        // Configurazione comune del grafico
        const chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top' as const,
              labels: {
                color: '#FFFFFF',
                font: {
                  family: 'Kanit',
                  size: 12
                }
              }
            },
            tooltip: {
              mode: 'index' as const,
              intersect: false,
              backgroundColor: 'rgba(39, 38, 44, 0.9)',
              titleColor: '#FFFFFF',
              bodyColor: '#FFFFFF',
              borderColor: '#383241',
              borderWidth: 1,
              padding: 12,
              displayColors: true,
              callbacks: {
                label: function(context: any) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.y !== null) {
                    label += formatCurrency(context.parsed.y, currency);
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
                font: { family: 'Kanit' }
              }
            },
            y: {
              grid: {
                color: 'rgba(255, 255, 255, 0.1)',
              },
              ticks: {
                color: '#7A6EAA',
                font: { family: 'Kanit' },
                callback: function(value: any) {
                  return formatCurrency(Number(value), currency);
                }
              }
            }
          },
          interaction: {
            intersect: false,
            mode: 'index' as const,
          },
          animation: {
            duration: 1000
          }
        };

        // Only show chart data when verification checkmarks are active
        if (verifiedPeriods.length === 0) {
          // Create empty chart with no data if no periods verified
          chartInstance.current = new Chart(ctx, {
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
            options: chartOptions
          });
          return;
        }

        // Filter period details based on verified periods
        const filteredDetails = periodDetails.filter(detail => 
          verifiedPeriods.includes(detail.period.toString())
        );

        // Prepare data for chart
        const labels = filteredDetails.map(detail => `Trade ${detail.period}`);
        const balanceData = filteredDetails.map(detail => detail.balance);
        const interestData = filteredDetails.map(detail => detail.interest);

        // Create chart
        chartInstance.current = new Chart(ctx, {
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
          options: chartOptions
        });
      }
    }
  }, [periodDetails, verifiedPeriods, currency]);

  return (
    <div className="bg-card-color rounded-3xl border border-border-color p-6 mb-6 shadow-lg animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Visualizzazione Crescita</h2>
      <div className="chart-container">
        <canvas ref={chartRef} id="growthChart"></canvas>
      </div>
    </div>
  );
}

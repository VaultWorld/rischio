import { PeriodDetail } from "@/components/CompoundInterestCalculator";

/**
 * Calculates compound interest based on provided parameters
 */
export function calculateCompoundInterest(
  initialCapital: number,
  periods: number,
  gainRate: number,
  riskRate: number
): { totalInterest: number; finalCapital: number; periodDetails: PeriodDetail[] } | null {
  // Verify that all values are valid
  if (
    isNaN(initialCapital) || 
    isNaN(periods) || 
    isNaN(gainRate) || 
    isNaN(riskRate) || 
    initialCapital <= 0 || 
    periods <= 0 || 
    gainRate <= 0 || 
    riskRate <= 0
  ) {
    return null;
  }

  // Convert percentage to decimal
  const riskRateDecimal = riskRate / 100;

  // Array for period details
  const periodDetails: PeriodDetail[] = [];

  // Calculate compound interest
  let currentBalance = initialCapital;

  for (let period = 1; period <= periods; period++) {
    // Calculate interest for this period based on risk rate
    const interest = currentBalance * riskRateDecimal;
    
    // Update balance
    const newBalance = currentBalance + interest;
    
    // Calculate return percentage
    const returnPercentage = ((newBalance - initialCapital) / initialCapital) * 100;
    
    // Store period details
    periodDetails.push({
      period,
      interest,
      balance: newBalance,
      returnPercentage
    });
    
    // Update current balance for next period
    currentBalance = newBalance;
  }

  // Calculate total interest and final capital
  const totalInterest = currentBalance - initialCapital;
  const finalCapital = currentBalance;

  return {
    totalInterest,
    finalCapital,
    periodDetails
  };
}

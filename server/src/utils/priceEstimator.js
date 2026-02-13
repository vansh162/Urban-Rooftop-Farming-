/**
 * Price Estimator for Leafinity Rooftop Farming Bookings
 * Calculates instant quotes in INR based on rooftop size and system type
 */

const PRICING = {
  soil: {
    baseRatePerSqFt: 100, // ₹100 per sq ft for soil-based systems
    minSize: 50, // Minimum 50 sq ft
    maxSize: 10000 // Maximum 10000 sq ft
  },
  hydro: {
    baseRatePerSqFt: 250, // ₹250 per sq ft for hydroponic systems
    minSize: 50,
    maxSize: 10000
  }
};

/**
 * Estimates booking price in INR
 * @param {Object} params
 * @param {number} params.rooftopSizeSqFt - Size of rooftop in square feet
 * @param {string} params.systemType - "soil" or "hydro"
 * @returns {Object} { success: boolean, estimatedPriceINR?: number, error?: string, breakdown?: Object }
 */
export const estimateBookingPriceINR = ({ rooftopSizeSqFt, systemType }) => {
  // Validation
  if (!rooftopSizeSqFt || typeof rooftopSizeSqFt !== "number" || rooftopSizeSqFt <= 0) {
    return {
      success: false,
      error: "Invalid rooftop size. Please provide a positive number."
    };
  }

  if (!systemType || !["soil", "hydro"].includes(systemType.toLowerCase())) {
    return {
      success: false,
      error: "Invalid system type. Must be 'soil' or 'hydro'."
    };
  }

  const type = systemType.toLowerCase();
  const config = PRICING[type];
  const size = Math.round(rooftopSizeSqFt);

  // Size validation
  if (size < config.minSize) {
    return {
      success: false,
      error: `Minimum rooftop size is ${config.minSize} sq ft.`
    };
  }

  if (size > config.maxSize) {
    return {
      success: false,
      error: `Maximum rooftop size is ${config.maxSize} sq ft. Please contact us for custom quotes.`
    };
  }

  // Calculate base price
  const basePrice = size * config.baseRatePerSqFt;

  // Optional: Add tiered pricing for larger installations
  let finalPrice = basePrice;
  let discount = 0;

  if (size > 5000) {
    // 5% discount for installations over 5000 sq ft
    discount = basePrice * 0.05;
    finalPrice = basePrice - discount;
  } else if (size > 2000) {
    // 3% discount for installations over 2000 sq ft
    discount = basePrice * 0.03;
    finalPrice = basePrice - discount;
  }

  return {
    success: true,
    estimatedPriceINR: Math.round(finalPrice),
    breakdown: {
      rooftopSizeSqFt: size,
      systemType: type,
      baseRatePerSqFt: config.baseRatePerSqFt,
      basePrice: Math.round(basePrice),
      discount: Math.round(discount),
      finalPrice: Math.round(finalPrice)
    }
  };
};

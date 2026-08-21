// Central currency formatter for the whole storefront — Pakistani Rupees.
// Using this everywhere means a currency change is a one-file edit.
export const formatPKR = (amount) => {
  const value = Number(amount) || 0;
  return `PKR ${value.toLocaleString('en-PK', { maximumFractionDigits: 0 })}`;
};

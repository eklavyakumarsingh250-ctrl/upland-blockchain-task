/**
 * Validates if a string is a valid Hex address (Task 1).
 */
const isValidAddress = (address) => {
  if (!address || typeof address !== 'string') return false;
  const hexRegex = /^[0-9a-fA-F]+$/;
  return hexRegex.test(address);
};

const isValidAmount = (amount) => {
  const num = Number(amount);
  return !isNaN(num) && num > 0;
};

const sanitizeAddress = (address) => address.trim();
const sanitizeAmount = (amount) => Number(amount);

module.exports = { 
  isValidAddress, 
  isValidAmount, 
  sanitizeAddress, 
  sanitizeAmount 
};

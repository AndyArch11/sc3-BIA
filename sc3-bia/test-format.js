const formatNumber = (value) => {
  if (value === 'N/A') return value;
  const num = parseFloat(value);
  if (isNaN(num)) return 'N/A';
  return num % 1 === 0 ? num.toString() : num.toFixed(2);
};

console.log('Test cases:');
console.log('formatNumber(24): ' + formatNumber(24));
console.log('formatNumber(24.0): ' + formatNumber(24.0));
console.log('formatNumber(24.5): ' + formatNumber(24.5));
console.log('formatNumber(24.50): ' + formatNumber(24.50));
console.log('formatNumber(24.123): ' + formatNumber(24.123));
console.log('formatNumber("24"): ' + formatNumber('24'));
console.log('formatNumber("24.5"): ' + formatNumber('24.5'));
console.log('formatNumber("N/A"): ' + formatNumber('N/A'));
console.log('formatNumber(""): ' + formatNumber(''));
console.log('formatNumber(null): ' + formatNumber(null));

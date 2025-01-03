module.exports = {
  singleQuote: true,
  importOrder: ['<THIRD_PARTY_MODULES>', '^@/', '^[./]'],
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrderSortSpecifiers: true,
};

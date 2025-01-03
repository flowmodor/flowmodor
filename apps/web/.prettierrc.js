const sharedConfig = require('../../.prettierrc.cjs');

module.exports = {
  ...sharedConfig,
  plugins: [...sharedConfig.plugins, 'prettier-plugin-tailwindcss'],
};

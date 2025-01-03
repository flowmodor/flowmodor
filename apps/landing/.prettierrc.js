import sharedConfig from '../../.prettierrc.cjs';

export default {
  ...sharedConfig,
  plugins: [
    ...sharedConfig.plugins,
    'prettier-plugin-astro',
    'prettier-plugin-tailwindcss',
  ],
};

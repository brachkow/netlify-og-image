import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/og-image.ts',
  output: {
    format: 'cjs',
    file: 'netlify/functions/og-image.js',
  },
  plugins: [typescript()],
};

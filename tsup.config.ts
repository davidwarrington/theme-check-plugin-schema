import { defineConfig } from 'tsup';

const rules = ['require-image-dimensions'];

export default [
  defineConfig({
    clean: true,
    entry: ['./src/index.ts'],
    dts: true,
    format: ['cjs', 'esm'],
  }),
  ...rules.map(rule =>
    defineConfig({
      clean: true,
      entry: [`./src/rules/${rule}/rules.ts`],
      outDir: `./src/rules/${rule}/dist`,
      dts: true,
      format: ['cjs', 'esm'],
    }),
  ),
];

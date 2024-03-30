import { join } from 'node:path';
import { check } from '@shopify/theme-check-node';
import { build } from 'tsup';

/** @param location `import.meta.url` */
export function setupTest(location: string) {
  const dirname = new URL('.', location).pathname;

  return {
    async build() {
      /**
       * `console.log` appears to be suppressed whilst this is running.
       * If you need `console.log`, try running `tsup --watch` to build
       * the rule in parallel with vitest.
       */
      await build({
        entry: [join(dirname, 'rules.ts')],
        outDir: join(dirname, 'dist'),
        format: ['cjs'],
        silent: true,
      });
    },

    async run() {
      const root = join(dirname, '__fixtures__');
      const offenses = await check(root, join(root, '.theme-check.yml'));

      function forConfig() {
        return offenses.filter(offense =>
          offense.absolutePath.endsWith(`/config/settings_schema.json`),
        );
      }

      function forSection(filename: string) {
        return offenses.filter(offense =>
          offense.absolutePath.endsWith(`/sections/${filename}.liquid`),
        );
      }

      return {
        forConfig,
        forSection,
        offenses,
      };
    },
  };
}

export async function buildCheck(dirname: string) {
  /**
   * `console.log` appears to be suppressed whilst this is running.
   * If you need `console.log`, try running `tsup --watch` to build
   * the rule in parallel with vitest.
   */
  await build({
    entry: [join(dirname, 'rules.ts')],
    outDir: join(dirname, 'dist'),
    format: ['cjs'],
    silent: true,
  });
}

export async function runCheck(dirname: string) {
  const root = join(dirname, '__fixtures__');
  const offenses = await check(root, join(root, '.theme-check.yml'));

  function forConfig() {
    return offenses.filter(offense =>
      offense.absolutePath.endsWith(`/config/settings_schema.json`),
    );
  }

  function forSection(filename: string) {
    return offenses.filter(offense =>
      offense.absolutePath.endsWith(`/sections/${filename}.liquid`),
    );
  }

  return {
    forConfig,
    forSection,
    offenses,
  };
}

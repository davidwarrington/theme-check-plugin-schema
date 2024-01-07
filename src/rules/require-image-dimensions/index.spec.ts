import { join } from 'node:path';
import { check } from '@shopify/theme-check-node';
import { build } from 'tsup';
import { beforeAll, describe, expect, it } from 'vitest';

const __dirname = new URL('.', import.meta.url).pathname;

async function runCheck() {
  const root = join(__dirname, '__fixtures__');
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

describe('theme-check/require-image-dimensions', () => {
  beforeAll(async () => {
    /**
     * `console.log` appears to be suppressed whilst this is running.
     * If you need `console.log`, try running `tsup --watch` to build
     * the rule in parallel with vitest.
     */
    await build({
      entry: [join(__dirname, 'index.ts')],
      outDir: join(__dirname, 'dist'),
      format: ['cjs'],
    });
  });

  it('reports to theme-check correctly', async () => {
    const { forConfig, forSection, offenses } = await runCheck();

    expect(offenses).toHaveLength(3);

    expect(forConfig()).toHaveLength(1);
    expect(forSection('no-info-property')).toHaveLength(1);
    expect(forSection('invalid-info-property')).toHaveLength(1);
    expect(forSection('valid-info-property')).toHaveLength(0);
  });

  it.todo('reports errors in the correct location', () => {});
});

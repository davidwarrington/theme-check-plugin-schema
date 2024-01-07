import { join } from 'node:path';
import { check } from '@shopify/theme-check-node';
import { build } from 'tsup';
import { beforeAll, describe, expect, it } from 'vitest';

const __dirname = new URL('.', import.meta.url).pathname;

async function runCheck() {
  const root = join(__dirname, '__fixtures__');
  const offenses = await check(root, join(root, '.theme-check.yml'));

  function forCase(testCase: string) {
    return offenses.filter(offense =>
      offense.absolutePath.endsWith(`/${testCase}.liquid`),
    );
  }

  return {
    forCase,
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
    const { forCase, offenses } = await runCheck();

    const noInfoPropertyOffenses = forCase('no-info-property');
    const invalidInfoPropertyOffenses = forCase('invalid-info-property');
    const validInfoPropertyOffenses = forCase('valid-info-property');

    expect(offenses).toHaveLength(2);

    expect(noInfoPropertyOffenses).toHaveLength(1);
    expect(invalidInfoPropertyOffenses).toHaveLength(1);
    expect(validInfoPropertyOffenses).toHaveLength(0);
  });

  it.todo('reports errors in the correct location', () => {});
});

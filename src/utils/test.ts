import { join } from 'node:path';
import { check } from '@shopify/theme-check-node';
import { build } from 'tsup';
import { describe, expect, it } from 'vitest';

/** @param location `import.meta.url` */
function setupTest(location: string) {
  const dirname = new URL('.', location).pathname;

  return {
    async build() {
      await build({
        clean: true,
        entry: [join(dirname, 'rules.ts')],
        outDir: join(dirname, 'dist'),
        format: ['cjs'],
        silent: true,
      });
    },

    async run() {
      const root = join(dirname, '__fixtures__');
      return check(root, join(root, '.theme-check.yml'));
    },
  };
}

export function testRule(config: {
  ruleName: string;
  /** `import.meta.url` */
  location: string;

  accept: {
    description: string;
    file: string;
  }[];
  reject: {
    description: string;
    file: string;
    message: string;
    startIndex: number;
    endIndex: number;
  }[];
}) {
  describe(config.ruleName, async () => {
    const test = setupTest(config.location);

    await test.build();
    const offenses = await test.run();

    config.accept.forEach(acceptConfig => {
      const relatedOffenses = offenses.filter(offense =>
        offense.absolutePath.endsWith(acceptConfig.file),
      );

      it(acceptConfig.description, () => {
        expect(relatedOffenses).toHaveLength(0);
      });
    });

    config.reject.forEach(rejectConfig => {
      const relatedOffenses = offenses.filter(offense =>
        offense.absolutePath.endsWith(rejectConfig.file),
      );

      it(rejectConfig.description, () => {
        expect(relatedOffenses).toHaveLength(1);

        relatedOffenses.forEach(offense => {
          expect(offense.message).toBe(rejectConfig.message);

          expect(offense.start.index).toBe(rejectConfig.startIndex);
          expect(offense.end.index).toBe(rejectConfig.endIndex);
        });
      });
    });
  });
}

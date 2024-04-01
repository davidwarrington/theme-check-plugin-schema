import { beforeAll, describe, expect, it } from 'vitest';
import { setupTest } from '../../utils/test';

const test = setupTest(import.meta.url);

describe('theme-check/id-casing', () => {
  beforeAll(async () => {
    await test.build();
  });

  it('reports to theme-check correctly', async () => {
    const { forConfig, forSection, offenses } = await test.run();

    expect(offenses).toHaveLength(2);

    expect(forConfig()).toHaveLength(1);
    expect(forSection('invalid-id')).toHaveLength(1);
    expect(forSection('valid-id')).toHaveLength(0);
  });

  it('reports errors in the correct location', async () => {
    const { forConfig, forSection } = await test.run();

    const configError = forConfig()[0];
    expect(configError.start.index).toBe(107);
    expect(configError.end.index).toBe(120);

    const invalidIdError = forSection('invalid-id')[0];
    expect(invalidIdError.start.index).toBe(98);
    expect(invalidIdError.end.index).toBe(111);
  });
});

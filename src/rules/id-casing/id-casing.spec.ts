import { describe, expect, it } from 'vitest';
import { idCasing } from './id-casing';

describe('id-casing', () => {
  it('errors on id is camel case', () => {
    const testCase = JSON.stringify({
      name: 'Camel case ID',
      settings: [
        {
          type: 'product',
          id: 'giftProduct',
          label: 'Gift Product',
        },
      ],
    });
    const result = idCasing({ schema: testCase });

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty(
      'message',
      'Expected ID "giftProduct" to be "gift_product"',
    );
  });

  it(`doesn't error if valid id is found`, () => {
    const testCase = JSON.stringify({
      name: 'Snake case ID',
      settings: [
        {
          type: 'product',
          id: 'gift_product',
          label: 'Gift Product',
        },
      ],
    });
    const result = idCasing({ schema: testCase });

    expect(result).toStrictEqual([]);
  });
});

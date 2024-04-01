import { testRule } from '../../utils/test';

testRule({
  ruleName: 'IDCasing',
  location: import.meta.url,

  accept: [
    {
      description: 'Valid ID',
      file: 'sections/valid-id.liquid',
    },
  ],

  reject: [
    {
      description: 'Invalid ID in JSON',
      file: 'config/settings_schema.json',
      message: 'Expected ID "giftProduct" to be "gift_product"',
      startIndex: 107,
      endIndex: 120,
    },
    {
      description: 'Invalid ID in Liquid',
      file: 'sections/invalid-id.liquid',
      message: 'Expected ID "giftProduct" to be "gift_product"',
      startIndex: 98,
      endIndex: 111,
    },
  ],
});

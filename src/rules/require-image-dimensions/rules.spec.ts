import { testRule } from '../../utils/test';

testRule({
  ruleName: 'RequireImageDimensions',
  location: import.meta.url,

  accept: [
    {
      description: 'Valid Info Property',
      file: 'sections/valid-info-property.liquid',
    },
  ],

  reject: [
    {
      description: 'Invalid Info Property in JSON',
      file: 'config/settings_schema.json',
      message: 'Image Picker must contain an "info" property',
      startIndex: 52,
      endIndex: 141,
    },
    {
      description: 'Invalid Info Property in Liquid',
      file: 'sections/invalid-info-property.liquid',
      message:
        'The info property must follow this pattern: "/Recommended Size: [\\d]+px x [\\d]+px/"',
      startIndex: 153,
      endIndex: 175,
    },
    {
      description: 'No Info Property in Liquid',
      file: 'sections/no-info-property.liquid',
      message: 'Image Picker must contain an "info" property',
      startIndex: 65,
      endIndex: 146,
    },
  ],
});

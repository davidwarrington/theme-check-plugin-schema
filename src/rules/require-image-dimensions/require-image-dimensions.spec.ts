import { describe, expect, it } from 'vitest';
import { requireImageDimensions } from './require-image-dimensions';

describe('require-image-dimensions', () => {
  it('errors on image_picker with no "info" property', () => {
    const testCase = JSON.stringify({
      name: 'No info property',
      settings: [
        {
          type: 'image_picker',
          id: 'image',
          label: 'Image',
        },
      ],
    });
    const result = requireImageDimensions(testCase);

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty(
      'message',
      'Image Picker must contain an "info" property',
    );
  });

  it('errors on image_picker "info" property without the matching pattern', () => {
    const testCase = JSON.stringify({
      name: 'Invalid info property',
      settings: [
        {
          type: 'image_picker',
          id: 'image',
          label: 'Image',
          info: 'Useless info',
        },
      ],
    });
    const result = requireImageDimensions(testCase);

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty(
      'message',
      'The info property must follow this pattern: "/Recommended Size: [\\d]+px x [\\d]+px/"',
    );
  });

  it(`finds errors in block settings`, () => {
    const testCase = JSON.stringify({
      name: 'Image picker in block settings',
      blocks: [
        {
          name: 'Image',
          type: 'image',
          settings: [
            {
              type: 'image_picker',
              id: 'image',
              label: 'Image',
            },
          ],
        },
      ],
    });
    const result = requireImageDimensions(testCase);

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty(
      'message',
      'Image Picker must contain an "info" property',
    );
  });

  it(`doesn't error if valid info is found`, () => {
    const testCase = JSON.stringify({
      name: 'With recommmended size',
      settings: [
        {
          type: 'image_picker',
          id: 'image',
          label: 'Image',
          info: 'Recommended Size: 100px x 100px',
        },
      ],
    });
    const result = requireImageDimensions(testCase);

    expect(result).toStrictEqual([]);
  });

  it(`doesn't error if no image_picker is found`, () => {
    const testCase = JSON.stringify({
      name: 'No image picker',
      settings: [
        {
          type: 'text',
          id: 'title',
          label: 'Title',
        },
      ],
    });
    const result = requireImageDimensions(testCase);

    expect(result).toStrictEqual([]);
  });
});

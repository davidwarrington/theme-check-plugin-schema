import parse, { type ObjectNode, type PropertyNode } from 'json-to-ast';
import { walk } from '../../utils/walk';

interface RequireImageDimensionsOptions {
  infoPattern?: RegExp;
  schema: string;
}

export const DEFAULT_INFO_PATTERN = /Recommended Size: [\d]+px x [\d]+px/;

export function requireImageDimensions({
  infoPattern = DEFAULT_INFO_PATTERN,
  schema,
}: RequireImageDimensionsOptions) {
  const ast = parse(schema, { loc: true });

  const errors: {
    message: string;
    node: ObjectNode | PropertyNode;
  }[] = [];

  walk(ast, {
    Object(node) {
      const isImagePickerSetting = getIsImagePicker(node);

      if (!isImagePickerSetting) {
        return;
      }

      const infoNode = node.children.find(child => child.key.value === 'info');

      if (!infoNode) {
        errors.push({
          message: 'Image Picker must contain an "info" property',
          node,
        });

        return;
      }

      const isValid = validateInfoNode(infoNode, infoPattern);

      if (isValid) {
        return;
      }

      errors.push({
        message: `The info property must follow this pattern: "${infoPattern}"`,
        node: infoNode,
      });
    },
  });

  return errors;
}

function getIsImagePicker(node: ObjectNode) {
  const typeNode = node.children.find(child => child.key.value === 'type');

  if (!typeNode) {
    return false;
  }

  return (
    typeNode.value.type === 'Literal' && typeNode.value.value === 'image_picker'
  );
}

function validateInfoNode(node: PropertyNode, pattern: RegExp) {
  const valueNode = node.value;

  return (
    valueNode.type === 'Literal' &&
    typeof valueNode.value === 'string' &&
    pattern.test(valueNode.value)
  );
}

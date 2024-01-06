import parse, { type ObjectNode, type PropertyNode } from 'json-to-ast';
import { walk } from '../../utils/walk';

export function requireImageDimensions(schema: string) {
  const infoPattern = /Recommended Size: [\d]+px x [\d]+px/;
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

      const isvalid = validateInfoNode(infoNode, infoPattern);

      if (isvalid) {
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

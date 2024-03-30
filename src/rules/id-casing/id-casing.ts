import parse, { type PropertyNode } from 'json-to-ast';
import snakeCase from 'lodash.snakecase';
import { walk } from '../../utils/walk';

interface IdCasingOptions {
  schema: string;
}

export function idCasing({ schema }: IdCasingOptions) {
  const ast = parse(schema, { loc: true });

  const errors: {
    message: string;
    node: PropertyNode;
  }[] = [];

  walk(ast, {
    Property(node) {
      const isIdProperty = node.key.value === 'id';

      if (!isIdProperty) {
        return;
      }

      // @ts-expect-error
      const key = node.value.value;
      const expectedValue = snakeCase(key);
      const isValid = expectedValue === key;

      if (isValid) {
        return;
      }

      errors.push({
        message: `Expected ID ${JSON.stringify(key)} to be ${JSON.stringify(expectedValue)}`,
        node,
      });
    },
  });

  return errors;
}

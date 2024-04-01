import parse, {
  type LiteralNode,
  type PropertyNode,
  type ValueNode,
} from 'json-to-ast';
import snakeCase from 'lodash.snakecase';
import { walk } from '../../utils/walk';

interface IdCasingOptions {
  schema: string;
}

export function idCasing({ schema }: IdCasingOptions) {
  const ast = parse(schema, { loc: true });

  const errors: {
    message: string;
    node: ValueNode;
  }[] = [];

  walk(ast, {
    Property(node) {
      const isIdProperty = getIsIdProperty(node);

      if (!isIdProperty) {
        return;
      }

      const actualValue = node.value.value;
      const expectedValue = snakeCase(actualValue);
      const isValid = expectedValue === actualValue;

      if (isValid) {
        return;
      }

      errors.push({
        message: `Expected ID ${JSON.stringify(actualValue)} to be ${JSON.stringify(expectedValue)}`,
        node: node.value,
      });
    },
  });

  return errors;
}

function getIsIdProperty(node: PropertyNode): node is Omit<
  PropertyNode,
  'value'
> & {
  value: Omit<LiteralNode, 'value'> & {
    value: string;
  };
} {
  const key = node.key.value;
  const isString =
    node.value.type === 'Literal' && typeof node.value.value === 'string';

  return key === 'id' && isString;
}

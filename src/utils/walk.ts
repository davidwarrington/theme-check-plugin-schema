import type {
  ArrayNode,
  ASTNode,
  IdentifierNode,
  ObjectNode,
  PropertyNode,
  LiteralNode,
  ValueNode,
} from 'json-to-ast';

export function walk(
  ast: IdentifierNode | PropertyNode | ValueNode,
  accessors: {
    Array?(node: ArrayNode): void;
    Identifier?(node: IdentifierNode): void;
    Literal?(node: LiteralNode): void;
    Object?(node: ObjectNode): void;
    Property?(node: PropertyNode): void;
  },
  root = ast,
) {
  switch (ast.type) {
    case 'Array':
      accessors.Array?.(ast);
      ast.children.forEach(node => walk(node, accessors, root));
      return;
    case 'Identifier':
      accessors.Identifier?.(ast);
      return;
    case 'Literal':
      accessors.Literal?.(ast);
      return;
    case 'Property':
      accessors.Property?.(ast);
      walk(ast.key, accessors, root);
      walk(ast.value, accessors, root);
      return;
    case 'Object':
      if (root !== ast) {
        accessors.Object?.(ast);
      }

      ast.children.forEach(node => walk(node, accessors, root));
      return;
    default:
      return never(ast, `Unhandled node type`);
  }
}

class JsonAstWalkerError extends Error {
  node: ASTNode;

  constructor(message: string, node: ASTNode) {
    super(message);

    this.node = node;
  }
}

function never(node: never, errorMessage: string) {
  throw new JsonAstWalkerError(errorMessage, node as ASTNode);
}

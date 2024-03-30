import {
  Severity,
  SourceCodeType,
  type JSONCheckDefinition,
  type LiquidCheckDefinition,
} from '@shopify/theme-check-common';
import { idCasing } from './id-casing';

export const IdCasingJson: JSONCheckDefinition = {
  meta: {
    code: 'Schema/IDCasing/Json',
    name: 'Require consistent ID casing',
    docs: {
      description:
        'This check enforces that IDs use consistent naming conventions',
      recommended: true,
      url: 'https://github.com/davidwarrington/theme-check-schema-plugin/src/rules/id-casing/README.md',
    },
    type: SourceCodeType.JSON,
    severity: Severity.ERROR,
    schema: {},
    targets: [],
  },

  create(context) {
    return {
      async onCodePathStart(file) {
        const errors = idCasing({
          schema: file.source,
        });

        errors.forEach(error => {
          const position = {
            startIndex: error.node.loc?.start.offset ?? 0,
            endIndex: error.node.loc?.end.offset ?? file.source.length,
          };

          context.report({
            message: error.message,
            ...position,
          });
        });
      },
    };
  },
};

export const IdCasingLiquid: LiquidCheckDefinition = {
  meta: {
    code: 'Schema/IDCasing/Liquid',
    name: 'Require consistent ID casing',
    docs: {
      description:
        'This check enforces that IDs use consistent naming conventions',
      recommended: true,
      url: 'https://github.com/davidwarrington/theme-check-schema-plugin/src/rules/id-casing/README.md',
    },
    type: SourceCodeType.LiquidHtml,
    severity: Severity.ERROR,
    schema: {},
    targets: [],
  },

  create(context) {
    return {
      async LiquidRawTag(node) {
        if (node.name !== 'schema') {
          return;
        }

        if (node.body.kind !== 'json') {
          return;
        }

        const errors = idCasing({
          schema: node.body.value,
        });

        errors.forEach(error => {
          const position = {
            startIndex:
              node.blockStartPosition.end + (error.node.loc?.start.offset ?? 0),
            endIndex: error.node.loc
              ? node.blockStartPosition.end + error.node.loc.end.offset
              : node.blockEndPosition.start,
          };

          context.report({
            message: error.message,
            ...position,
          });
        });
      },
    };
  },
};

export const checks = [IdCasingJson, IdCasingLiquid];

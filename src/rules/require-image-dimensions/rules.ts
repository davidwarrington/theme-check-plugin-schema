import {
  SchemaProp,
  Severity,
  SourceCodeType,
  type JSONCheckDefinition,
  type LiquidCheckDefinition,
} from '@shopify/theme-check-common';
import {
  DEFAULT_INFO_PATTERN,
  requireImageDimensions,
} from './require-image-dimensions';

export const RequireImageDimensionsJson: JSONCheckDefinition = {
  meta: {
    code: 'Schema/RequireImageDimensions/Json',
    name: 'Require image dimensions with image pickers',
    docs: {
      description:
        'This check enforces that an info property is included with image pickers, and that it includes recommended dimensions',
      recommended: true,
      url: 'https://github.com/davidwarrington/theme-check-schema-plugin/src/rules/require-image-dimensions/README.md',
    },
    type: SourceCodeType.JSON,
    severity: Severity.ERROR,
    schema: {
      pattern: SchemaProp.string(DEFAULT_INFO_PATTERN.source).optional(),
    },
    targets: [],
  },

  create(context) {
    return {
      async onCodePathStart(file) {
        const errors = requireImageDimensions({
          infoPattern: new RegExp(context.settings.pattern),
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

export const RequireImageDimensionsLiquid: LiquidCheckDefinition = {
  meta: {
    code: 'Schema/RequireImageDimensions/Liquid',
    name: 'Require image dimensions with image pickers',
    docs: {
      description:
        'This check enforces that an info property is included with image pickers, and that it includes recommended dimensions',
      recommended: true,
      url: 'https://github.com/davidwarrington/theme-check-schema-plugin/src/rules/require-image-dimensions/README.md',
    },
    type: SourceCodeType.LiquidHtml,
    severity: Severity.ERROR,
    schema: {
      pattern: SchemaProp.string(DEFAULT_INFO_PATTERN.source).optional(),
    },
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

        const errors = requireImageDimensions({
          infoPattern: new RegExp(context.settings.pattern),
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

export const checks = [
  RequireImageDimensionsJson,
  RequireImageDimensionsLiquid,
];

import {
  type LiquidCheckDefinition,
  SchemaProp,
  Severity,
  SourceCodeType,
} from '@shopify/theme-check-common';
import {
  DEFAULT_INFO_PATTERN,
  requireImageDimensions,
} from './require-image-dimensions';

export const RequireImageDimensions: LiquidCheckDefinition = {
  meta: {
    code: 'RequireImageDimensions',
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
      pattern: SchemaProp.string(String(DEFAULT_INFO_PATTERN)).optional(),
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

        errors.map(error => {
          const { startIndex, endIndex } = (() => {
            if (!error.node.loc) {
              return {
                startIndex: node.blockStartPosition.end,
                endIndex: node.blockEndPosition.start,
              };
            }

            return {
              startIndex: error.node.loc.start.offset,
              endIndex: error.node.loc.end.offset,
            };
          })();

          context.report({
            message: error.message,
            startIndex,
            endIndex,
          });
        });
      },
    };
  },
};

export const checks = [RequireImageDimensions];

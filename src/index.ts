import { IdCasingJson, IdCasingLiquid } from './rules/id-casing/rules';
import {
  RequireImageDimensionsJson,
  RequireImageDimensionsLiquid,
} from './rules/require-image-dimensions/rules';

const allChecks = [
  IdCasingJson,
  IdCasingLiquid,
  RequireImageDimensionsJson,
  RequireImageDimensionsLiquid,
];

export const checks = allChecks;

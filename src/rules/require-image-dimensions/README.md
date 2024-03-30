# Schema/RequireImageDimensions/{Json,Liquid}

Require image dimensions are provided for image pickers.

```jsonc
{
  "type": "image_picker",
  "id": "image",
  "label": "Image",
  "info": "Recommended image size: 100px x 100px",
  // Dimensions provided in `info` property
}
```

## Config

```yaml
Schema/RequireImageDimensions/Json:
  enabled: true
  severity: error

Schema/RequireImageDimensions/Liquid:
  enabled: true
  severity: error
```

## Options

### pattern

Type: `string`

Default: `Recommended Size: [\\d]+px x [\\d]+px`

Used as a regex pattern to test the `info` property against.

Given the string:

```json
"Recommended size: [\\d]+px x [\\d]+px"
```

The following patterns are considered problems:

```json
""
```

```json
"A big image for the background"
```

```json
"Size: 10x10px"
```

The following patterns are _not_ considered problems:

```json
"Recommended Size: 10px x 10px"
```

```json
"Recommended Size: 200px x 156px"
```

```json
"Recommended Size: 9px x 3003px"
```

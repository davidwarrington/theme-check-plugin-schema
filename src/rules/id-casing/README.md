# Schema/IDCasing/{Json,Liquid}

Require consistent casing for setting IDs.

```jsonc
{
  "id": "link_url",
}
```

## Config

```yaml
Schema/IDCasing/Json:
  enabled: true
  severity: error

Schema/IDCasing/Liquid:
  enabled: true
  severity: error
```

The following patterns are considered problems:

```jsonc
// camel case
"giftProduct"
```

```json
// pascal case
"GiftProduct"
```

```json
// kebab case
"gift-product"
```

The following patterns are _not_ considered problems:

```json
// snake case
"gift_product"
```

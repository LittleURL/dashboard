# LittleURL Dashboard

## SSM Parameters

There are some values that are required to be set in SSM, these are generated from both the
[infrastructure](https://github.com/DeltaByte/littleurl-infrastructure) and
[api](https://github.com/DeltaByte/littleurl-api) projects. This is generally done due to needing higher than
normal permissions, being a globally unique resource, or because of dependencies on other resources.

| name                         | source         | description                                             |
| ---------------------------- | -------------- | ------------------------------------------------------- |
| `/littleurl/cloudflare-zone` | infrastructure | ZoneID of the Cloudflare zone for deploying DNS records |
| `/littleurl/cognito-pool`    | api            | Cognito User Pool ARN                                   |

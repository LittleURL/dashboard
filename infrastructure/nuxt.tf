output "nuxt" {
  description = "Env config for nuxt build in CI"
  value = templatefile("./templates/nuxt.tpl", {
    env = {
      COGNITO_POOL_ID = data.aws_ssm_parameter.cognito_pool.value,
      COGNITO_CLIENT_ID = data.aws_ssm_parameter.cognito_client.value,
      COGNITO_PASSWORD_POLICY = "${data.aws_ssm_parameter.cognito_password_policy.value}",
      COGNITO_REGION = var.aws_region
    }
  })
  sensitive = true
}

output "nuxt_deploy" {
  description = "Keys for uploading files to S3"
  value = jsonencode({
    bucket       = aws_s3_bucket.dashboard.id
    distribution = aws_cloudfront_distribution.dashboard.id
  })
}

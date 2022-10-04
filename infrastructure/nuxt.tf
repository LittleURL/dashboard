output "nuxt" {
  description = "Env config for nuxt build in CI"
  value = templatefile("./templates/nuxt.tpl", {
    env = {
      COGNITO_ = local.domain,
      FIRE_ENV    = local.firebase_env
    }
  })
}

output "nuxt_deploy" {
  description = "Keys for uploading files to S3"
  value = jsonencode({
    bucket       = aws_s3_bucket.dashboard.id
    distribution = aws_cloudfront_distribution.dashboard.id
  })
}

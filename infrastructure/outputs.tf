output "dashboard_bucket" {
  value = aws_s3_bucket.dashboard.id
}

output "dashboard_distribution" {
  value = aws_cloudfront_distribution.dashboard.id
}

output "aws_assume_role" {
  value = "arn:aws:iam::${local.aws_account}:role/${var.aws_role}"
}

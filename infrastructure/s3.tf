resource "aws_s3_bucket" "dashbaord" {
  bucket_prefix = "${local.prefix}dashboard-"
}

resource "aws_s3_bucket_acl" "dashboard" {
  bucket = aws_s3_bucket.dashboard.id
  acl    = "private"
}

resource "aws_s3_bucket_versioning" "dashboard" {
  bucket = aws_s3_bucket.dashboard.id
  versioning_configuration {
    status = "Disabled"
  }
}

resource "aws_s3_bucket_website_configuration" "dashboard" {
  bucket = aws_s3_bucket.dashboard.bucket

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

# ----------------------------------------------------------------------------------------------------------------------
# Cloudfront access
# ----------------------------------------------------------------------------------------------------------------------
resource "aws_s3_bucket_policy" "cloudfront" {
  bucket = aws_s3_bucket.dashbaord.id
  policy = data.aws_iam_policy_document.s3_policy_cloudfront.json
}

data "aws_iam_policy_document" "s3_policy_cloudfront" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.dashboard.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.dashboard.iam_arn]
    }
  }
}

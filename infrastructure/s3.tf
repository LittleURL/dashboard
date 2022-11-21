resource "aws_s3_bucket" "dashboard" {
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

resource "aws_s3_bucket_public_access_block" "dashboard" {
  bucket                  = aws_s3_bucket.dashboard.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true

  # Don't modify this bucket in two ways at the same time, S3 API will complain.
  depends_on = [aws_s3_bucket_policy.cloudfront]
}

resource "aws_s3_bucket_cors_configuration" "dashboard" {
  bucket = aws_s3_bucket.dashboard.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["HEAD", "GET", "POST", "PUT", "DELETE"]
    allowed_origins = ["https://api.${local.domain}"]
    # expose_headers  = ["ETag"]
  }
}

# ----------------------------------------------------------------------------------------------------------------------
# Cloudfront access
# ----------------------------------------------------------------------------------------------------------------------
resource "aws_s3_bucket_policy" "cloudfront" {
  bucket = aws_s3_bucket.dashboard.id
  policy = data.aws_iam_policy_document.s3_policy_cloudfront.json
}

data "aws_iam_policy_document" "s3_policy_cloudfront" {
  statement {
    actions   = ["s3:ListBucket", "s3:GetObject"]
    resources = [aws_s3_bucket.dashboard.arn, "${aws_s3_bucket.dashboard.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.dashboard.iam_arn]
    }
  }
}

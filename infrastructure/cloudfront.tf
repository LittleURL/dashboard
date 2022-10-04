locals {
  dashboard_s3_origin = "s3_${local.domain_dashboard}"
}

resource "aws_cloudfront_origin_access_identity" "dashboard" {
  comment = "LittleURL Dashboard"
}

resource "aws_cloudfront_distribution" "dashboard" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "LittleURL Dashboard"
  price_class         = "PriceClass_200"
  default_root_object = "index.html"

  aliases = [local.domain_dashboard]

  viewer_certificate {
    cloudfront_default_certificate = false
    acm_certificate_arn = aws_acm_certificate.dashboard.arn
  }

  origin {
    domain_name = aws_s3_bucket.dashboard.bucket_regional_domain_name
    origin_id   = local.dashboard_s3_origin

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.dashboard.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    target_origin_id       = local.dashboard_s3_origin
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD", "OPTIONS"]
    viewer_protocol_policy = "allow-all"

    // TTL
    min_ttl     = 0
    default_ttl = 3600
    max_ttl     = 86400

    forwarded_values {
      query_string = true

      cookies {
        forward = "all"
      }
    }

    restrictions {
      geo_restriction {
        restriction_type = "none"
      }
    }
  }
}

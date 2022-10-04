
resource "cloudflare_record" "dashboard" {
  zone_id = local.zone_id
  name    = local.domain_dashboard
  type    = "CNAME"
  value   = aws_cloudfront_distribution.dashboard.domain_name
  proxied = true
}

# ----------------------------------------------------------------------------------------------------------------------
# Origin Cert
# ----------------------------------------------------------------------------------------------------------------------
resource "aws_acm_certificate" "dashboard" {
  domain_name       = local.domain_dashboard
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "cloudflare_record" "dashboard_cert" {
  for_each = {
    for dvo in aws_acm_certificate.dashboard.domain_validation_options : dvo.domain_name => {
      resource_record_name  = dvo.resource_record_name
      resource_record_value = dvo.resource_record_value
      resource_record_type  = dvo.resource_record_type
    }
  }

  zone_id = local.zone_id
  proxied = false

  name  = each.value.resource_record_name
  type  = each.value.resource_record_type
  value = trimsuffix(each.value.resource_record_value, ".")
}

resource "aws_acm_certificate_validation" "dashboard" {
  certificate_arn         = aws_acm_certificate.dashboard.arn
  validation_record_fqdns = [for record in cloudflare_record.dashboard_cert : record.hostname]
}
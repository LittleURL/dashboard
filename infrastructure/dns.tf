locals {
  domain_dashboard = "dash.${data.aws_route53_zone.main.name}"
}

data "aws_ssm_parameter" "zone_id" {
  name = "/${var.application}/zone-id"
}

data "aws_route53_zone" "main" {
  zone_id = data.aws_ssm_parameter.zone_id.value
}

# ----------------------------------------------------------------------------------------------------------------------
# Records
# ----------------------------------------------------------------------------------------------------------------------
resource "aws_route53_record" "dashboard" {
  zone_id = data.aws_ssm_parameter.zone_id.value

  name = local.domain_dashboard
  type = "A"

  alias {
    name                   = aws_cloudfront_distribution.dashboard.domain_name
    zone_id                = aws_cloudfront_distribution.dashboard.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_acm_certificate" "dashboard" {
  domain_name       = local.domain_dashboard
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "dashboard_cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.dashboard.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  zone_id         = data.aws_route53_zone.main.zone_id
  name            = each.value.name
  type            = each.value.type
  ttl             = 60
  records         = [each.value.record]
  allow_overwrite = true
}


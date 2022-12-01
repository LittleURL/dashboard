data "aws_ssm_parameter" "cognito_pool" {
  name = "/${var.application}/cognito/pool-id"
}

data "aws_ssm_parameter" "cognito_password_policy" {
  name = "/${var.application}/cognito/password-policy"
}

data "aws_ssm_parameter" "cognito_client" {
  name = "/${var.application}/cognito/client-dashboard"
}
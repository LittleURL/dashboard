# data "aws_ssm_parameter" "cognito_pool" {
#   name = "/${var.application}/cognito-pool"
# }

# resource "aws_cognito_user_pool_client" "dashboard" {
#   name = "dashboard"

#   user_pool_id = data.aws_ssm_parameter.cognito_pool.value
# }
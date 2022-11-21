locals {
  prefix           = "${var.application}-"
  environment      = contains(var.environments, terraform.workspace) ? terraform.workspace : "dev"
  aws_account      = lookup(var.aws_accounts, local.environment)
}

variable "application" {
  type        = string
  description = "Application name for prefixing globally unique resource names"
  default     = "littleurl"
}

variable "environments" {
  type    = set(string)
  default = ["dev", "prod"]
}

# ----------------------------------------------------------------------------------------------------------------------
# AWS
# ----------------------------------------------------------------------------------------------------------------------
variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "aws_role" {
  type    = string
  default = "deploy-dashboard"
}

variable "aws_accounts" {
  type = map(string)
  default = {
    dev  = "000000000000"
    prod = "000000000000"
  }
}

variable "aws_default_tags" {
  type        = map(string)
  description = "Common resource tags for all AWS resources"
  default = {
    application = "LittleURL"
    service     = "dashboard"
  }
}

# ----------------------------------------------------------------------------------------------------------------------
# CORS
# ----------------------------------------------------------------------------------------------------------------------
variable "cors_origins" {
  type = map(list(string))
  default = {
    dev  = ["*"]
    prod = ["https://littleurl.io"]
  }
}

variable "cors_expose" {
  type = map(list(string))
  default = {
    dev  = ["*"]
    prod = []
  }
}

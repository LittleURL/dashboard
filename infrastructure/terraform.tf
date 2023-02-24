terraform {
  backend "s3" {
    key                  = "dashboard.tfstate"
    workspace_key_prefix = "state"
    region               = "us-east-1"
    dynamodb_table       = "littleurl-terraform-lock"
    bucket               = "littleurl-terraform-state"
    encrypt              = true
    role_arn             = "arn:aws:iam::000000000000:role/LittleurlTerraformRemotestateDev"
    assume_role_tags = {
      application = "littleurl"
      service     = "dashboard"
    }
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.22"
    }
  }
}

# ----------------------------------------------------------------------------------------------------------------------
# Providers
# ----------------------------------------------------------------------------------------------------------------------
provider "aws" {
  region = "us-east-1"
  default_tags { tags = var.aws_default_tags }
  allowed_account_ids = [local.aws_account]

  assume_role {
    role_arn = "arn:aws:iam::${local.aws_account}:role/${var.aws_role}"
  }
}

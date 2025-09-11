terraform {
    required_version = ">= 1.6.0"
    required_providers { aws = { source = "hashicorp/aws", version = ">= 5.0" } }
    backend "s3" {}
}


provider "aws" {
    region = var.region
}


module "iam" { source = "./modules/iam" }
module "dynamodb" { source = "./modules/dynamodb" table_name = var.table_orders }
module "eventbridge" { source = "./modules/eventbridge" bus_name = var.bus_name }
module "lambdas" {
    source = "./modules/lambdas"
    api_env = {
        TABLE_ORDERS = var.table_orders
        EVENT_BUS = var.bus_name
    }
}
module "api" {
    source = "./modules/api"
    lambda_arn = module.lambdas.api_lambda_arn
    invoke_arn = module.lambdas.api_lambda_invoke_arn
}
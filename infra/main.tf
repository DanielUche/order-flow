terraform {
  required_version = ">= 1.6.0"
  required_providers { aws = { source = "hashicorp/aws", version = ">= 5.0" } }
  backend "s3" {}
}


provider "aws" {
  region = var.region
}


module "iam" { source = "./modules/iam" }
module "dynamodb" {
  source = "./modules/dynamodb"
  table_name = var.table_orders
}
module "eventbridge" {
  source   = "./modules/eventbridge"
  bus_name = var.bus_name
  sqs_arn  = module.queues.queue_arn
  sns_arn  = module.topics.topic_arn
}
module "lambdas" {
  source        = "./modules/lambdas"
  api_env       = {
    TABLE_ORDERS = var.table_orders
    EVENT_BUS    = var.bus_name
  }
  processor_env = {
    LAKE_BUCKET = module.s3_lake.bucket
    LAKE_PREFIX = "events/"
  }
  notifier_env  = {}
  athena_env    = {
    ATHENA_DB        = module.glue_athena.db_name
    ATHENA_WORKGROUP = module.glue_athena.workgroup
    S3_OUTPUT        = "s3://${module.s3_lake.bucket}/athena-results/"
  }
  sqs_arn       = module.queues.queue_arn
  sns_arn       = module.topics.topic_arn
}
module "api" {
  source = "./modules/api"
  lambda_arn = module.lambdas.api_lambda_arn
  invoke_arn = module.lambdas.api_lambda_invoke_arn
  athena_invoke_arn = module.lambdas.athena_report_arn
}

module "queues" {
  source = "./modules/queues"
  queue_name = "orderflow-order-events"
  processor_lambda_arn = module.lambdas.processor_lambda_arn
}


module "topics" {
  source     = "./modules/topics"
  topic_name = "orderflow-notifications"
  notifier_lambda_arn = "arn:aws:lambda:us-east-1:123456789012:function:orderflow-notifier"
}


module "s3_lake" {
  source      = "./modules/s3_lake"
  bucket_name = "app-orderflow-lake-dev"
  env         = "dev"
}


module "glue_athena" {
  source        = "./modules/glue_athena"
  db_name       = "orderflow_dev"
  bucket        = module.s3_lake.bucket
  prefix        = "events/"
  s3_path       = "s3://app-orderflow-lake-dev/glue-athena/"
  glue_role_arn = "arn:aws:iam::123456789012:role/glue-athena-role"
}






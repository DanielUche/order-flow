variable "glue_role_arn" {
  description = "ARN of the Glue role"
  type        = string
}

variable "db_name" { type = string }
variable "bucket" { type = string }
variable "prefix" { type = string }

variable "s3_path" {
  description = "S3 target path for the Glue crawler"
  type        = string
}

resource "aws_glue_catalog_database" "db" { name = var.db_name }


resource "aws_glue_crawler" "events" {
  name = "orderflow-events-crawler"
  role = aws_iam_role.glue.arn
    database_name = aws_glue_catalog_database.db.name
  s3_target { path = "s3://${var.bucket}/${var.prefix}" }
  schedule = "cron(0 */6 * * ? *)" # every 6 hours
}

resource "aws_iam_role" "glue" {
  name = "orderflow-glue-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{ Effect="Allow", Principal={ Service="glue.amazonaws.com" }, Action="sts:AssumeRole" }]
  })
}


resource "aws_iam_role_policy" "glue_access" {
  role = aws_iam_role.glue.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      { Effect="Allow", Action=["s3:*"], Resource=["arn:aws:s3:::${var.bucket}", "arn:aws:s3:::${var.bucket}/*"] },
      { Effect="Allow", Action=["glue:*"], Resource=["*"] }
      ]
    })
}

resource "aws_athena_workgroup" "wg" {
  name = "orderflow-wg"
  configuration {
    enforce_workgroup_configuration = false
  }
}


output "db_name" { value = aws_glue_catalog_database.db.name }
output "crawler_name" { value = aws_glue_crawler.events.name }
output "workgroup" { value = aws_athena_workgroup.wg.name }
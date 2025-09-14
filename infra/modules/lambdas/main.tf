variable "api_env" { type = map(string) }
variable "processor_env" { type = map(string) }
variable "notifier_env" { type = map(string) }
variable "athena_env" { type = map(string) }
variable "sqs_arn" { type = string }
variable "sns_arn" { type = string }


resource "aws_iam_role" "lambda" {
  name = "orderflow-lambda-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{ Effect = "Allow", Principal = { Service = "lambda.amazonaws.com" }, Action = "sts:AssumeRole" }]
  })
}

# Attach extra policies for S3, SQS, SNS, Glue, Athena
resource "aws_iam_role_policy" "lambda_extra" {
  role = aws_iam_role.lambda.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
    { Effect="Allow", Action:["dynamodb:*"], Resource:["*"] },
    { Effect="Allow", Action:["events:PutEvents"], Resource:["*"] },
    { Effect="Allow", Action:["sqs:*"], Resource:[var.sqs_arn] },
    { Effect="Allow", Action:["sns:Publish"], Resource:[var.sns_arn] },
    { Effect="Allow", Action:["s3:PutObject","s3:GetObject","s3:ListBucket"], Resource:["*"] },
    { Effect="Allow", Action:["athena:*","glue:*","s3:*"], Resource:["*"] }
    ]
  })
}


resource "aws_iam_role_policy_attachment" "basic" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}


resource "aws_lambda_function" "api" {
  function_name = "orderflow-api"
  role = aws_iam_role.lambda.arn
  handler = "index.handler"
  runtime = "nodejs20.x"
  filename = "${path.module}/zips/api.zip" # Upload artifact in CI
  source_code_hash = filebase64sha256("${path.module}/zips/api.zip")
  environment { variables = var.api_env }
}

resource "aws_lambda_function" "processor" {
  function_name = "orderflow-processor"
  role = aws_iam_role.lambda.arn
  handler = "index.handler"
  runtime = "nodejs20.x"
  filename = "${path.module}/zips/processor.zip"
  source_code_hash = filebase64sha256("${path.module}/zips/processor.zip")
  environment { variables = var.processor_env }
}

resource "aws_lambda_event_source_mapping" "sqs_to_processor" {
  event_source_arn = var.sqs_arn
  function_name = aws_lambda_function.processor.arn
  batch_size = 10
}

resource "aws_lambda_function" "notifier" {
  function_name = "orderflow-notifier-email"
  role = aws_iam_role.lambda.arn
  handler = "index.handler"
  runtime = "nodejs20.x"
  filename = "${path.module}/zips/notifier-email.zip"
  source_code_hash = filebase64sha256("${path.module}/zips/notifier-email.zip")
  environment { variables = var.notifier_env }
}

resource "aws_sns_topic_subscription" "notifier_sub" {
  topic_arn = var.sns_arn
  protocol = "lambda"
  endpoint = aws_lambda_function.notifier.arn
}

resource "aws_lambda_permission" "sns_invoke_notifier" {
  statement_id = "AllowSNSToInvoke"
  action = "lambda:InvokeFunction"
  function_name = aws_lambda_function.notifier.function_name
  principal = "sns.amazonaws.com"
  source_arn = var.sns_arn
}

resource "aws_lambda_function" "athena_report" {
  function_name = "orderflow-athena-report"
  role = aws_iam_role.lambda.arn
  handler = "index.handler"
  runtime = "nodejs20.x"
  filename = "${path.module}/zips/athena-report.zip"
  source_code_hash = filebase64sha256("${path.module}/zips/athena-report.zip")
  environment { variables = var.athena_env }
}


output "api_lambda_arn" { value = aws_lambda_function.api.arn }
output "api_lambda_invoke_arn" { value = aws_lambda_function.api.invoke_arn }
output "processor_arn" { value = aws_lambda_function.processor.arn }
output "notifier_arn" { value = aws_lambda_function.notifier.arn }
output "athena_report_arn" { value = aws_lambda_function.athena_report.arn }
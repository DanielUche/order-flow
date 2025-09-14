variable "notifier_lambda_arn" {
  description = "ARN of the notifier Lambda function"
  type        = string
}

variable "topic_name" { type = string }

resource "aws_sns_topic" "notifications" { name = "orderflow-notifications" }

resource "aws_sns_topic_subscription" "email" {
    topic_arn = aws_sns_topic.notifications.arn
    protocol = "lambda"
    endpoint = var.notifier_lambda_arn
}

resource "aws_sns_topic" "this" { name = var.topic_name }

resource "aws_lambda_permission" "sns_invoke" {
    statement_id = "AllowSNSTrigger"
    action = "lambda:InvokeFunction"
    function_name = var.notifier_lambda_arn
    principal = "sns.amazonaws.com"
    source_arn = aws_sns_topic.notifications.arn
}

output "topic_arn" { value = aws_sns_topic.this.arn }
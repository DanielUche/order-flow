variable "alarm_topic_arn" { type = string }
variable "function_names" { type = list(string) }
variable "dlq_arns" { type = list(string) }


# Lambda Errors >= 1 in a 5m window
resource "aws_cloudwatch_metric_alarm" "lambda_errors" {
  for_each = toset(var.function_names)
  alarm_name = "orderflow-${each.value}-errors"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods = 1
  metric_name = "Errors"
  namespace = "AWS/Lambda"
  period = 300
  statistic = "Sum"
  threshold = 1
  dimensions = { FunctionName = each.value }
  alarm_description = "Lambda errors detected for ${each.value}"
  alarm_actions = [var.alarm_topic_arn]
}


# SQS DLQ has messages visible
resource "aws_cloudwatch_metric_alarm" "dlq_depth" {
  for_each = toset(var.dlq_arns)
  alarm_name = "orderflow-dlq-depth-${replace(each.value, ":", "-")}"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods = 1
  metric_name = "ApproximateNumberOfMessagesVisible"
  namespace = "AWS/SQS"
  period = 300
  statistic = "Sum"
  threshold = 1
  dimensions = {
      QueueName = split(":", each.value)[length(split(":", each.value)) - 1]
  }
  alarm_description = "Messages visible in DLQ ${each.value}"
  alarm_actions = [var.alarm_topic_arn]
}


# Glue crawler failure via EventBridge -> SNS (alarm-like notification)
resource "aws_cloudwatch_event_rule" "glue_crawler_failure" {
  name = "orderflow-glue-crawler-failure"
  description = "Notify on Glue crawler failure"
  event_pattern = jsonencode({
      "source": ["aws.glue"],
      "detail-type": ["Glue Crawler State Change"],
      "detail": { "state": ["FAILED"] }
  })
}


resource "aws_cloudwatch_event_target" "glue_to_sns" {
  rule = aws_cloudwatch_event_rule.glue_crawler_failure.name
  target_id = "to-sns"
  arn = var.alarm_topic_arn
}
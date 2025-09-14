variable "bus_name" { type = string }
variable "sqs_arn" { type = string }
variable "sns_arn" { type = string }

resource "aws_cloudwatch_event_bus" "this" { name = var.bus_name }

resource "aws_cloudwatch_event_rule" "order_created" {
  name = "order-created"
  event_bus_name = aws_cloudwatch_event_bus.this.name
  event_pattern = jsonencode({
    "source": ["orderflow.api"],
    "detail-type": ["OrderCreated"]
  })
}

resource "aws_cloudwatch_event_target" "to_sqs" {
  rule = aws_cloudwatch_event_rule.order_created.name
  event_bus_name = aws_cloudwatch_event_bus.this.name
  arn = var.sqs_arn
}

resource "aws_cloudwatch_event_target" "to_sns" {
  rule = aws_cloudwatch_event_rule.order_created.name
  event_bus_name = aws_cloudwatch_event_bus.this.name
  arn = var.sns_arn
}


output "bus_arn" { value = aws_cloudwatch_event_bus.this.arn }
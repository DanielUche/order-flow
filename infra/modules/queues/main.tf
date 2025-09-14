variable "processor_lambda_arn" {
  description = "The ARN of the processor lambda"
  type        = string
}

variable "queue_name" { type = string }

resource "aws_sqs_queue" "order_events" {
    name = "orderflow-order-events"
}

resource "aws_lambda_event_source_mapping" "processor" {
    event_source_arn = aws_sqs_queue.order_events.arn
    function_name = var.processor_lambda_arn
    batch_size = 10
}

resource "aws_sqs_queue" "events" {
    name = var.queue_name
    message_retention_seconds = 1209600
    visibility_timeout_seconds = 30
    redrive_policy = jsonencode({ deadLetterTargetArn = aws_sqs_queue.dlq.arn, maxReceiveCount = 5 })
}

resource "aws_sqs_queue" "dlq" { name = "${var.queue_name}-dlq" }

output "queue_url" { value = aws_sqs_queue.order_events.id }

output "queue_arn" { value = aws_sqs_queue.events.arn }
output "queue_url" { value = aws_sqs_queue.events.id }
output "dlq_arn" { value = aws_sqs_queue.dlq.arn }
variable "bus_name" { type = string }
resource "aws_cloudwatch_event_bus" "this" { name = var.bus_name }
output "bus_arn" { value = aws_cloudwatch_event_bus.this.arn }
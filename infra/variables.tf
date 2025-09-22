variable "region" {
	description = "AWS region to deploy resources"
	type        = string
	default     = "us-east-1"
}

variable "table_orders" {
	description = "Name of the DynamoDB orders table"
	type        = string
	default     = "orderflow_orders_dev"
}

variable "bus_name" {
	description = "Name of the EventBridge bus"
	type        = string
	default     = "orderflow-dev"
}

variable "account_alias" {
  type    = string
  default = "daniel"
}

output "web_domain" { value = module.website.domain_name }

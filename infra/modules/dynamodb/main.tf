variable "table_name" { type = string }


resource "aws_dynamodb_table" "orders" {
name = var.table_name
billing_mode = "PAY_PER_REQUEST"
hash_key = "id"


attribute { name = "id" type = "S" }
}


output "table_name" { value = aws_dynamodb_table.orders.name }
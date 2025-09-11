output "api_url" { value = module.api.invoke_url }
output "event_bus" { value = var.bus_name }
output "orders_table" { value = var.table_orders }
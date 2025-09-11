variable "lambda_arn" { type = string }
variable "invoke_arn" { type = string }


resource "aws_apigatewayv2_api" "http" {
    name = "orderflow-http"
    protocol_type = "HTTP"
}


resource "aws_apigatewayv2_integration" "lambda" {
    api_id = aws_apigatewayv2_api.http.id
    integration_type = "AWS_PROXY"
    integration_uri = var.invoke_arn
    payload_format_version = "2.0"
}


resource "aws_apigatewayv2_route" "get_orders" {
    api_id = aws_apigatewayv2_api.http.id
    route_key = "GET /orders"
    target = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}


resource "aws_apigatewayv2_route" "post_orders" {
    api_id = aws_apigatewayv2_api.http.id
    route_key = "POST /orders"
    target = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}


resource "aws_lambda_permission" "apigw" {
    statement_id = "AllowAPIGatewayInvoke"
    action = "lambda:InvokeFunction"
    function_name = var.lambda_arn
    principal = "apigateway.amazonaws.com"
    source_arn = "${aws_apigatewayv2_api.http.execution_arn}/*/*"
}


resource "aws_apigatewayv2_stage" "dev" {
    api_id = aws_apigatewayv2_api.http.id
    name = "dev"
    auto_deploy = true
}


output "invoke_url" {
    value = "${aws_apigatewayv2_api.http.api_endpoint}/${aws_apigatewayv2_stage.dev.name}" 
}
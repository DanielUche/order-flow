variable "api_env" { type = map(string) }


resource "aws_iam_role" "lambda" {
    name = "orderflow-lambda-role"
    assume_role_policy = jsonencode({
        Version = "2012-10-17",
        Statement = [{ Effect = "Allow", Principal = { Service = "lambda.amazonaws.com" }, Action = "sts:AssumeRole" }]
    })
}


resource "aws_iam_role_policy_attachment" "basic" {
    role = aws_iam_role.lambda.name
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


output "api_lambda_arn" { value = aws_lambda_function.api.arn }
output "api_lambda_invoke_arn" { value = aws_lambda_function.api.invoke_arn }
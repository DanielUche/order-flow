variable "env" {
  description = "The environment name"
  type        = string
}

variable "bucket_name" { type = string }

resource "aws_s3_bucket" "lake" {
  bucket = var.bucket_name
}
resource "aws_s3_bucket_lifecycle_configuration" "lc" {
  bucket = aws_s3_bucket.lake.id
  rule {
    id     = "expire-raw-365"
    status = "Enabled"
    filter {}
    expiration {
      days = 365
    }
  }
}
output "bucket" { value = aws_s3_bucket.lake.bucket }
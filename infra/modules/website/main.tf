variable "site_bucket" {
  type = string
}

variable "comment" {
  type    = string
  default = "orderflow web"
}

resource "aws_s3_bucket" "site" {
  bucket = var.site_bucket
}

# CloudFront will access the S3 bucket via Origin Access Control (OAC)
resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "orderflow-oac"
  description                       = "OAC for CloudFront -> S3 static site"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "cdn" {
  enabled             = true
  comment             = var.comment
  default_root_object = "index.html"

  origin {
    domain_name = aws_s3_bucket.site.bucket_regional_domain_name
    origin_id   = "s3-site"
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "s3-site"

    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = true
      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

# Allow CloudFront (via OAC) to read from the bucket
resource "aws_s3_bucket_policy" "allow_cf" {
  bucket = aws_s3_bucket.site.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid:    "AllowCloudFrontOAC",
        Effect: "Allow",
        Principal = {
          Service = "cloudfront.amazonaws.com"
        },
        Action   = ["s3:GetObject"],
        Resource = ["${aws_s3_bucket.site.arn}/*"],
        Condition = {
          StringEquals = {
            "AWS:SourceArn" : aws_cloudfront_distribution.cdn.arn
          }
        }
      }
    ]
  })
}

output "bucket" {
  value = aws_s3_bucket.site.bucket
}

output "distribution_id" {
  value = aws_cloudfront_distribution.cdn.id
}

output "domain_name" {
  value = aws_cloudfront_distribution.cdn.domain_name
}

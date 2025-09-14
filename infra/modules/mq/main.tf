resource "aws_mq_broker" "this" {
    broker_name = "orderflow-dev"
    engine_type = "ActiveMQ"
    engine_version = "5.17.6"
    host_instance_type = "mq.t3.micro"
    publicly_accessible = true
    user {
        username = "admin"
        password = "Admin12345!"
    }
}
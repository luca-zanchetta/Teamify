# Fonte: https://www.rabbitmq.com/tutorials/tutorial-three-python.html
import pika

# Create a new connection
connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
# Create a new channel
channel = connection.channel()

# Create a new exchange
channel.exchange_declare(exchange='logs', exchange_type='fanout')

# Define and publish a message
message = "Hello from Python Publisher"
channel.basic_publish(exchange='logs', routing_key='', body=message)

print(f" [x] Sent '{message}'")

connection.close()

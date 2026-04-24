# Import library and create instance of REST client.
from Adafruit_IO import Client
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables from .env file
username = os.getenv('ADAFRUIT_IO_USERNAME')
key = os.getenv('ADAFRUIT_IO_KEY')
aio = Client(username, key)

# Retrieve the most recent value from the feed 'Foo'.
# Access the value by reading the `value` property on the returned Data object.
# Note that all values retrieved from IO are strings so you might need to convert
# them to an int or numeric type if you expect a number.
data = aio.receive('temp')
print('Received value: {0}'.format(data.value))
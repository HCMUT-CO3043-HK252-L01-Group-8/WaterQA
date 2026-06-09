import time
import random
import os
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from Adafruit_IO import Client
from dotenv import load_dotenv

import os
from pathlib import Path

script_dir = Path(__file__).parent
env_path = script_dir / "../../../../.env"
load_dotenv(dotenv_path=env_path)

username = os.getenv('ADAFRUIT_IO_USERNAME')
key = os.getenv('ADAFRUIT_IO_KEY')

if not username or not key:
    print("Lỗi: Không tìm thấy thông tin ADAFRUIT_IO_USERNAME hoặc ADAFRUIT_IO_KEY.")
    print("Hãy đảm bảo bạn đã cấu hình file .env đúng vị trí hoặc thiết lập biến môi trường.")
    exit(1)

aio = Client(username, key)

print("Đã kết nối Adafruit IO. Bắt đầu đẩy dữ liệu ảo...")

try:
    while True:
        #tạo số liệu ngẫu nhiên
        ph = round(random.uniform(6.5, 8.5), 2) 
        hardness = round(random.uniform(100.0, 250.0), 2)
        solids = round(random.uniform(10000.0, 25000.0), 2)
        chloramines = round(random.uniform(4.0, 8.0), 2)
        sulfate = round(random.uniform(250.0, 350.0), 2)
        conductivity = round(random.uniform(300.0, 500.0), 2)
        organic_carbon = round(random.uniform(8.0, 16.0), 2)
        trihalomethanes = round(random.uniform(50.0, 80.0), 2)
        turbidity = round(random.uniform(2.0, 5.0), 2)

        print(f"[{time.strftime('%H:%M:%S')}] Đang gửi dữ liệu...")

        # đẩy dữ liệu lên Adafruit IO
        try:
            aio.send('ph', ph)
            aio.send('hardness', hardness)
            aio.send('solids', solids)
            aio.send('chloramines', chloramines)
            aio.send('sulfate', sulfate)
            aio.send('conductivity', conductivity)
            aio.send('organic-carbon', organic_carbon)
            aio.send('trihalomethanes', trihalomethanes)
            aio.send('turbidity', turbidity)
            print("  -> Gửi thành công!")
        except Exception as e:
            print(f"  -> Lỗi khi gửi: {e}")
            print("  -> (Chưa đủ feed trên Adafruit IO)")
        time.sleep(30)

except KeyboardInterrupt:
    print("\nĐã dừng mô phỏng")

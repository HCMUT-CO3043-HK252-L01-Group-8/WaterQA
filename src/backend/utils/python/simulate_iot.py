import time
import random
import os
from Adafruit_IO import Client
from dotenv import load_dotenv

# Tải biến môi trường từ file .env (nếu file script để cùng thư mục backend, hãy trỏ đúng đường dẫn)
# Ở đây ta lấy tạm từ cùng thư mục hoặc bạn cài sẵn trong biến môi trường
load_dotenv(dotenv_path='../../.env')

username = os.getenv('ADAFRUIT_IO_USERNAME')
key = os.getenv('ADAFRUIT_IO_KEY')

if not username or not key:
    print("Lỗi: Không tìm thấy thông tin ADAFRUIT_IO_USERNAME hoặc ADAFRUIT_IO_KEY.")
    print("Hãy đảm bảo bạn đã cấu hình file .env đúng vị trí hoặc thiết lập biến môi trường.")
    exit(1)

# Khởi tạo Adafruit IO Client
aio = Client(username, key)

print("Đã kết nối Adafruit IO. Bắt đầu đẩy dữ liệu ảo...")

try:
    while True:
        # Tạo số liệu ngẫu nhiên giả lập cảm biến
        temp = round(random.uniform(25.0, 35.0), 2)  # Nhiệt độ 25 - 35
        humi = round(random.uniform(50.0, 80.0), 2)  # Độ ẩm 50 - 80
        light = round(random.uniform(0.0, 100.0), 2) # Ánh sáng 0 - 100
        
        ph = round(random.uniform(6.5, 8.5), 2) 
        hardness = round(random.uniform(100.0, 250.0), 2)
        solids = round(random.uniform(10000.0, 25000.0), 2)
        chloramines = round(random.uniform(4.0, 8.0), 2)
        sulfate = round(random.uniform(250.0, 350.0), 2)
        conductivity = round(random.uniform(300.0, 500.0), 2)
        organic_carbon = round(random.uniform(8.0, 16.0), 2)
        trihalomethanes = round(random.uniform(50.0, 80.0), 2)
        turbidity = round(random.uniform(2.0, 5.0), 2)

        print(f"[{time.strftime('%H:%M:%S')}] Đang gửi dữ liệu IoT và hóa học...")

        # Đẩy dữ liệu lên Adafruit IO (Lưu ý: Tên feed phải tạo trước trên web Adafruit)
        try:
            aio.send('temp', temp)
            aio.send('humi', humi)
            aio.send('light', light)
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
            print("  -> (Lưu ý: Hãy chắc chắn bạn đã tạo đầy đủ feed trên Adafruit IO)")

        # Dừng 30 giây rồi gửi tiếp để tránh limit Adafruit (30 requests/phút)
        time.sleep(30)

except KeyboardInterrupt:
    print("\nĐã dừng mô phỏng IoT.")

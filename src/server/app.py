from flask import Flask, request, jsonify
from flask_cors import CORS
from SRT import SRT
from SRT.train import SRTTrain
from SRT.passenger import Adult
from datetime import datetime
from dotenv import load_dotenv
import os

# 환경 변수 로드
load_dotenv()

app = Flask(__name__)

# CORS 설정
cors_config = {
    "origins": [
        "http://localhost:3000",  # 개발 환경
        "https://your-frontend-domain.com"  # 프로덕션 환경
    ],
    "methods": ["GET", "POST"],  # 허용할 HTTP 메서드
    "allow_headers": [
        "Content-Type",
        "Authorization",
        "Access-Control-Allow-Credentials"
    ],
    "expose_headers": [
        "Content-Range",
        "X-Content-Range"
    ],
    "supports_credentials": True,  # 쿠키 및 인증 헤더 허용
    "max_age": 600,  # preflight 요청 캐시 시간 (초)
    "send_wildcard": False,  # 와일드카드(*) 대신 실제 origin 반환
    "vary_header": True  # Vary 헤더에 Origin 추가
}

# 환경별 CORS 설정
if os.getenv('FLASK_ENV') == 'development':
    CORS(app)  # 개발 환경: 모든 도메인 허용
else:
    CORS(app, resources={
        r"/api/*": cors_config  # 프로덕션 환경: 특정 설정 적용
    })

# 추가 보안 헤더 설정
@app.after_request
def add_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    return response

def get_srt_client():
    """SRT 클라이언트 인스턴스를 생성하고 반환"""
    return SRT(
        os.getenv('SRT_ID'),
        os.getenv('SRT_PASSWORD')
    )

@app.route('/api/search-trains', methods=['POST'])
def search_trains():
    try:
        data = request.json
        
        # SRT 인스턴스 생성 및 로그인
        srt = get_srt_client()
        
        # 열차 검색
        trains = srt.search_train(
            dep=data.get('departure'),
            arr=data.get('arrival'),
            date=data.get('date'),
            time=data.get('time')
        )
        
        # 열차 정보를 JSON으로 변환
        train_list = []
        for train in trains:
            train_info = {
                "id": train.train_number,
                "train_name": train.train_name,
                "dep_time": train.dep_time,
                "dep_station": train.dep_station_name,
                "arr_time": train.arr_time,
                "arr_station": train.arr_station_name,
                "seats": train.general_seat_available()
            }
            train_list.append(train_info)
            
        return jsonify({"success": True, "trains": train_list})
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/reserve-train', methods=['POST'])
def reserve_train():
    try:
        data = request.json
        
        # SRT 인스턴스 생성 및 로그인
        srt = get_srt_client()
        
        # 열차 검색으로 train 객체 얻기
        trains = srt.search_train(
            dep=data.get('departure'),
            arr=data.get('arrival'),
            date=data.get('date'),
            time=data.get('time')
        )
        for train in trains:
            print(train.train_number)
        
        selected_trains = data.get('selectedTrains', [])
        print(selected_trains)
        passenger_count = data.get('passengerCount', 1)
        print(passenger_count)
        
        # 선택된 모든 열차에 대해 예매 시도
        for train_index in selected_trains:
            try:
                reservation = srt.reserve(
                    trains[train_index],
                    passengers=[Adult(passenger_count)]
                )
                
                # 예매 성공 시 예매 정보 반환
                return jsonify({
                    "success": True,
                    "reservation": {
                        "number": reservation.reservation_number,
                        "price": reservation.total_cost,
                        "train_number": reservation.train_number,
                        "dep_station": reservation.dep_station_name,
                        "arr_station": reservation.arr_station_name,
                        "dep_time": reservation.dep_time,
                        "arr_time": reservation.arr_time
                    }
                })
            except Exception as e:
                continue  # 실패 시 다음 열차 시도
                
        # 모든 열차 예매 실패 시
        return jsonify({
            "success": False,
            "error": "선택된 모든 열차의 예매가 실패했습니다."
        }), 400
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 
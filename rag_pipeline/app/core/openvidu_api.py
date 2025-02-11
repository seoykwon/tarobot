# openvidu_api.py
import requests
import base64
from fastapi import HTTPException
from app.core.settings import settings

def _auth_header():
    # Basic Auth: "OPENVIDU_SECRET" -> base64
    token_str = f"OPENVIDUAPP:{settings.openvidu_secret}"
    b64_val = base64.b64encode(token_str.encode()).decode()
    return {"Authorization": f"Basic {b64_val}", "Content-Type": "application/json"}

def create_openvidu_session(custom_session_id: str = None):
    url = f"{settings.openvidu_url}/openvidu/api/sessions"
    body = {}
    if custom_session_id:
        body["customSessionId"] = custom_session_id
    print(custom_session_id)
    resp = requests.post(url, json=body, headers=_auth_header(), verify=False)
    if resp.status_code not in [200, 201]:
        raise HTTPException(status_code=500, detail=f"OpenVidu 세션 생성 오류: {resp.text}")
    return resp.json()

def create_openvidu_connection(session_id: str):
    """
    OpenVidu 2.31.0에서는 /tokens API가 제거됨.
    대신, /sessions/{sessionId}/connection을 사용해야 함.
    """
    url = f"{settings.openvidu_url}/openvidu/api/sessions/{session_id}/connection"
    body = {
        "type": "WEBRTC",  # WebRTC 연결을 기본값으로 설정
        "role": "PUBLISHER",  # 클라이언트 권한 설정 (SUBSCRIBER, MODERATOR 가능)
        "kurentoOptions": None,  # 필요시 설정 추가
    }
    print(f"[DEBUG] OpenVidu 연결 요청: {session_id}")

    resp = requests.post(url, json=body, headers=_auth_header(), verify=False)
    if resp.status_code not in [200, 201]:
        raise HTTPException(status_code=500, detail=f"OpenVidu Connection 생성 오류: {resp.text}")
    return resp.json()

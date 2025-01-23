from transformers import AutoTokenizer, AutoModelForCausalLM
from transformers import GenerationConfig
import torch, os

# 모델 이름 및 로컬 디렉터리 설정
model_name = "maywell_Synatra-42dot-1.3B"
local_dir = os.path.join(
    r"C:\Users\SSAFY\Desktop\git\S12P11A107\chatend\app\models", model_name
)

tokenizer = AutoTokenizer.from_pretrained(local_dir)
model = AutoModelForCausalLM.from_pretrained(local_dir)

# GPU 또는 CPU 설정
device = "cuda" if torch.cuda.is_available() else "cpu"
model = model.to(device)  # 모델을 GPU/CPU로 이동

def get_response(message: str, history: list = None) -> str:
    """
    모델 추론을 통해 응답 생성
    """
    # if history is None:
    #     history = []

    # # 최근 5개의 대화만 유지
    # if len(history) > 5:
    #     history = history[-5:]

    # # 최근 대화 기록 변환
    # history_context = "\n".join(history) if history else "대화 기록이 없습니다."

    # # 프롬프트 생성
    # context = (
    #     f"history:\n{history_context}\n"
    #     f"User: {message}\nBot:"
    # )
    #### 히스토리를 반영할 경우 인풋이 너무 길어져서 이를 반복하는 챗봇의 특성 때문에 답변이 제대로 안나옴옴

    context = (
        f"User: {message}\nBot:"
    )
    inputs = tokenizer.encode(context, return_tensors="pt").to(device)

    generation_config = GenerationConfig(
        max_length=100,
        temperature=0.8,
        top_p=0.9,
        repetition_penalty=1.2,
        num_return_sequences=1,
        do_sample=True,
        # pad_token_id=tokenizer.eos_token_id,
        # eos_token_id=tokenizer.eos_token_id,
    )

    # 모델 추론
    response_ids = model.generate(
        inputs,
        generation_config=generation_config
    )

    response = tokenizer.decode(response_ids[0], skip_special_tokens=True)

    print(response)

    # "Bot:" 이후 텍스트만 추출
    if "Bot:" in response:
        response = response.split("Bot:")[-1].strip()

    return response.strip()


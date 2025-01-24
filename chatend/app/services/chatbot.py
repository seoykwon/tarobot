from unsloth import FastLanguageModel
from transformers import TextStreamer
from unsloth.chat_templates import get_chat_template
import torch, os


# model_name = "maywell/Synatra-42dot-1.3B"
# local_dir = os.path.join(
#     r"C:\Users\SSAFY\Desktop\git\S12P11A107\chatend\app\models", model_name
# )
model_name = "trained_model"
local_dir = os.path.join(
    r"C:\Users\mgh12\Desktop\PJ\git\S12P11A107\chatend\app\models", model_name
)

model, tokenizer = FastLanguageModel.from_pretrained(
    # model_name = "unsloth/Llama-3.2-3B-Instruct",
    model_name = local_dir,
    max_seq_length = 8192,
    load_in_4bit = True,
    # token = "hf_...", # use one if using gated models like meta-llama/Llama-2-7b-hf
)

tokenizer = get_chat_template(
    tokenizer,
    chat_template = "llama-3.1",
    # mapping = {"role" : "from", "content" : "value", "user" : "human", "assistant" : "gpt"}, # ShareGPT style
)

FastLanguageModel.for_inference(model) # Enable native 2x faster inference


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
    #### 히스토리를 반영할 경우 인풋이 너무 길어져서 이를 반복하는 챗봇의 특성 때문에 답변이 제대로 안나옴

    template = [
                                # EDIT HERE!
        # {"from": "human", "value": message},
        {"role": "human", "content": message},
    ]
    inputs = tokenizer.apply_chat_template(template, tokenize = True, add_generation_prompt = True, return_tensors = "pt").to("cuda")

    text_streamer = TextStreamer(tokenizer)
    response_ids = model.generate(
        input_ids=inputs,
        streamer=text_streamer,
        max_new_tokens=100,
        use_cache=True,
        temperature=1.1,
        top_p=0.85,
        min_p=0.05,
        repetition_penalty=1.2,
    )

    response = tokenizer.decode(response_ids[0], skip_special_tokens=True)

    print(response)

    # 응답 텍스트 추출
    response_text = response.split("assistant", 1)[-1].strip()

    return response_text


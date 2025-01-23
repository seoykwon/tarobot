from transformers import AutoTokenizer, AutoModelForCausalLM

# 모델과 토크나이저를 로컬 디렉터리에 저장
model_name = "maywell/Synatra-42dot-1.3B"
local_dir = f"./models/{model_name.replace('/', '_')}"

tokenizer = AutoTokenizer.from_pretrained(model_name)
tokenizer.save_pretrained(local_dir)

model = AutoModelForCausalLM.from_pretrained(model_name)
model.save_pretrained(local_dir)

print(f"Model and tokenizer saved to {local_dir}")

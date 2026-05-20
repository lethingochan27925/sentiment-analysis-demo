# import torch
# import torch.nn as nn
# from pathlib import Path
# from transformers import AutoModel, AutoTokenizer
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel

# # ---------------------------------------------------------------------------
# # Config
# # ---------------------------------------------------------------------------
# BASE_PATH = Path(__file__).parent.parent / "saved_models" / "best_model" / "RoBERTa_3L_base_with_emoji"
# DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
# LABELS = ["negative", "neutral", "positive"]

# # ---------------------------------------------------------------------------
# # Model — phải khớp CHÍNH XÁC với kiến trúc lúc train
# # ---------------------------------------------------------------------------
# class RoBERTa_3L(nn.Module):
#     def __init__(self, bert_path: str):
#         super().__init__()
#         self.bert = AutoModel.from_pretrained(bert_path, local_files_only=True)

#         self.drop = nn.Dropout(0.5)

#         self.bilstm1 = nn.LSTM(768, 250, batch_first=True, bidirectional=True)  # → 500
#         self.bilstm2 = nn.LSTM(500, 150, batch_first=True, bidirectional=True)  # → 300
#         self.bilstm3 = nn.LSTM(300,  50, batch_first=True, bidirectional=True)  # → 100

#         self.ln   = nn.LayerNorm(100)
#         self.relu = nn.ReLU()
#         self.fc   = nn.Linear(100, 3)

#     def forward(self, input_ids, attention_mask):
#         x = self.bert(
#             input_ids=input_ids,
#             attention_mask=attention_mask
#         ).last_hidden_state           # (B, T, 768)

#         x = self.drop(x)
#         x, _ = self.bilstm1(x)       # (B, T, 500)

#         x = self.drop(x)
#         x, _ = self.bilstm2(x)       # (B, T, 300)

#         x = self.drop(x)
#         x, _ = self.bilstm3(x)       # (B, T, 100)

#         x = x.mean(dim=1)            # mean pooling → (B, 100)
#         x = self.ln(x)
#         x = self.relu(x)
#         x = self.drop(x)
#         x = self.fc(x)               # (B, 3)
#         return x

# # ---------------------------------------------------------------------------
# # Load tokenizer & model
# # ---------------------------------------------------------------------------
# tokenizer = AutoTokenizer.from_pretrained(
#     str(BASE_PATH / "tokenizer"),
#     local_files_only=True
# )

# model = RoBERTa_3L(bert_path=str(BASE_PATH / "bert_backbone"))

# state_dict = torch.load(
#     BASE_PATH / "best.pth",
#     map_location=DEVICE,
#     weights_only=False
# )
# model.load_state_dict(state_dict)   # strict=True — sẽ báo lỗi nếu vẫn còn mismatch
# model.to(DEVICE)
# model.eval()

# # ---------------------------------------------------------------------------
# # FastAPI app
# # ---------------------------------------------------------------------------
# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:5173",
#         "http://127.0.0.1:5173",
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# class TextRequest(BaseModel):
#     text: str


# @app.get("/")
# def root():
#     return {"message": "Sentiment Analysis API Running"}


# @app.post("/predict")
# def predict(request: TextRequest):
#     inputs = tokenizer(
#         request.text,
#         return_tensors="pt",
#         truncation=True,
#         max_length=128,   # khớp với max_len=128 lúc train
#         padding=True
#     ).to(DEVICE)

#     with torch.no_grad():
#         logits = model(
#             input_ids=inputs["input_ids"],
#             attention_mask=inputs["attention_mask"]
#         )
#         probs = torch.softmax(logits, dim=-1).squeeze().tolist()

#     pred_idx = probs.index(max(probs))

#     return {
#         "input_text": request.text,
#         "label": LABELS[pred_idx],
#         "confidence": round(probs[pred_idx], 4),
#         "probabilities": dict(zip(LABELS, [round(p, 4) for p in probs]))
#     }

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
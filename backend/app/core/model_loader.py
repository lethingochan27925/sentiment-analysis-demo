# import torch.nn as nn
# from transformers import AutoModel


# class RoBERTa_3L(nn.Module):
#     def __init__(self, bert_path: str):
#         super().__init__()
#         self.bert = AutoModel.from_pretrained(bert_path, local_files_only=True)

#         self.drop = nn.Dropout(0.5)

#         self.bilstm1 = nn.LSTM(768, 250, batch_first=True, bidirectional=True)
#         self.bilstm2 = nn.LSTM(500, 150, batch_first=True, bidirectional=True)
#         self.bilstm3 = nn.LSTM(300, 50, batch_first=True, bidirectional=True)

#         self.ln = nn.LayerNorm(100)
#         self.relu = nn.ReLU()
#         self.fc = nn.Linear(100, 3)

#     def forward(self, input_ids, attention_mask):
#         x = self.bert(
#             input_ids=input_ids,
#             attention_mask=attention_mask
#         ).last_hidden_state

#         x = self.drop(x)
#         x, _ = self.bilstm1(x)

#         x = self.drop(x)
#         x, _ = self.bilstm2(x)

#         x = self.drop(x)
#         x, _ = self.bilstm3(x)

#         x = x.mean(dim=1)
#         x = self.ln(x)
#         x = self.relu(x)
#         x = self.drop(x)
#         x = self.fc(x)

#         return x

import torch
from transformers import AutoTokenizer

from app.config import BASE_PATH, DEVICE
from app.models.hybrid_bert import RoBERTa_3L


tokenizer = AutoTokenizer.from_pretrained(
    str(BASE_PATH / "tokenizer"),
    local_files_only=True
)

model = RoBERTa_3L(
    bert_path=str(BASE_PATH / "bert_backbone")
)

state_dict = torch.load(
    BASE_PATH / "best.pth",
    map_location=DEVICE,
    weights_only=False
)

model.load_state_dict(state_dict)
model.to(DEVICE)
model.eval()
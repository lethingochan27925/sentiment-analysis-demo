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

import torch.nn as nn
from transformers import AutoModel


class RoBERTa_3L(nn.Module):

    def __init__(self, bert_path: str):
        super().__init__()

        self.bert = AutoModel.from_pretrained(
            bert_path,
            local_files_only=True
        )

        self.drop = nn.Dropout(0.5)

        self.bilstm1 = nn.LSTM(
            768,
            250,
            batch_first=True,
            bidirectional=True
        )

        self.bilstm2 = nn.LSTM(
            500,
            150,
            batch_first=True,
            bidirectional=True
        )

        self.bilstm3 = nn.LSTM(
            300,
            50,
            batch_first=True,
            bidirectional=True
        )

        self.ln = nn.LayerNorm(100)

        self.relu = nn.ReLU()

        self.fc = nn.Linear(100, 3)

    def forward(
        self,
        input_ids,
        attention_mask,
        output_attentions=False
    ):

        bert_outputs = self.bert(
            input_ids=input_ids,
            attention_mask=attention_mask,
            output_attentions=output_attentions
        )

        x = bert_outputs.last_hidden_state

        x = self.drop(x)

        x, _ = self.bilstm1(x)

        x = self.drop(x)

        x, _ = self.bilstm2(x)

        x = self.drop(x)

        x, _ = self.bilstm3(x)

        x = x.mean(dim=1)

        x = self.ln(x)

        x = self.relu(x)

        x = self.drop(x)

        logits = self.fc(x)

        if output_attentions:
            return logits, bert_outputs.attentions

        return logits
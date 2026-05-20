import torch

from app.config import DEVICE, LABELS, MAX_LEN
from app.core.model_loader import tokenizer, model


def predict_sentiment(text: str):
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        max_length=MAX_LEN,
        padding=True
    ).to(DEVICE)

    with torch.no_grad():
        logits = model(
            input_ids=inputs["input_ids"],
            attention_mask=inputs["attention_mask"]
        )

        probs = torch.softmax(logits, dim=-1).squeeze().tolist()

    pred_idx = probs.index(max(probs))

    return {
        "input_text": text,
        "label": LABELS[pred_idx],
        "confidence": round(probs[pred_idx], 4),
        "probabilities": dict(
            zip(LABELS, [round(p, 4) for p in probs])
        )
    }
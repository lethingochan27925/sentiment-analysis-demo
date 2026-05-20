import torch

from app.config import DEVICE, LABELS, MAX_LEN
from app.core.model_loader import tokenizer, model


def explain_attention(text: str):
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        max_length=MAX_LEN,
        padding=True
    ).to(DEVICE)

    # Ép eager attention để output_attentions hoạt động
    model.bert.config._attn_implementation = "eager"

    with torch.no_grad():
        bert_output = model.bert(
            input_ids=inputs["input_ids"],
            attention_mask=inputs["attention_mask"],
            output_attentions=True
        )

        attentions = bert_output.attentions
        x = bert_output.last_hidden_state

        x = model.drop(x)
        x, _ = model.bilstm1(x)
        x = model.drop(x)
        x, _ = model.bilstm2(x)
        x = model.drop(x)
        x, _ = model.bilstm3(x)

        x = x.mean(dim=1)
        x = model.ln(x)
        x = model.relu(x)
        logits = model.fc(x)

        probs = torch.softmax(logits, dim=-1).squeeze()

    pred_idx = int(torch.argmax(probs))
    pred_label = LABELS[pred_idx]

    # Attention layer cuối, trung bình qua heads, từ CLS token
    last_attention = attentions[-1]                        # [1, heads, seq, seq]
    avg_attention = last_attention.mean(dim=1).squeeze(0)  # [seq, seq]
    token_scores = avg_attention[0].detach().cpu()         # scores từ <s>

    input_ids = inputs["input_ids"][0].tolist()
    raw_tokens = tokenizer.convert_ids_to_tokens(input_ids)

    special_ids = {
        tokenizer.bos_token_id,
        tokenizer.eos_token_id,
        tokenizer.pad_token_id,
    }

    # Gom subword tokens thành words
    # RoBERTa: token bắt đầu bằng Ġ = đầu word mới
    # Decode cả nhóm ids một lần để tránh vỡ emoji/unicode
    groups = []   # mỗi phần tử: (list_of_ids, list_of_scores)
    current_ids = []
    current_scores = []

    for i, (tid, raw_tok) in enumerate(zip(input_ids, raw_tokens)):
        if tid in special_ids:
            if current_ids:
                groups.append((current_ids[:], current_scores[:]))
                current_ids, current_scores = [], []
            continue

        score = float(token_scores[i])
        is_new_word = raw_tok.startswith("Ġ") or raw_tok.startswith("▁")

        if is_new_word and current_ids:
            groups.append((current_ids[:], current_scores[:]))
            current_ids, current_scores = [], []

        current_ids.append(tid)
        current_scores.append(score)

    if current_ids:
        groups.append((current_ids, current_scores))

    # Decode từng group một lần → đúng emoji/unicode
    raw_word_scores = []
    for ids, scores in groups:
        word = tokenizer.decode(ids, clean_up_tokenization_spaces=False).strip()
        if word:
            raw_word_scores.append((word, max(scores)))

    if not raw_word_scores:
        return {"input_text": text, "label": pred_label,
                "confidence": round(float(probs[pred_idx]), 4), "attention": []}

    # --- Normalize với power scaling để tăng contrast ---
    scores_only = [s for _, s in raw_word_scores]
    s_min = min(scores_only)
    s_max = max(scores_only)
    denom = s_max - s_min if s_max != s_min else 1e-8

    word_list = []
    for word, score in raw_word_scores:
        # Min-max normalize
        normalized = (score - s_min) / denom
        # Power scaling: làm nổi bật các từ quan trọng hơn
        scaled = float(normalized ** 0.4)
        word_list.append({
            "word": word,
            "score": round(scaled, 4)
        })

    return {
        "input_text": text,
        "label": pred_label,
        "confidence": round(float(probs[pred_idx]), 4),
        "attention": word_list
    }
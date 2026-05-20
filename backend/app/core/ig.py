import torch

from app.config import DEVICE, LABELS, MAX_LEN
from app.core.model_loader import tokenizer, model

N_STEPS = 50


def _forward_from_embeds(embeds: torch.Tensor, attention_mask: torch.Tensor) -> torch.Tensor:
    """Chạy toàn bộ model từ embedding đầu vào."""
    bert_out = model.bert(
        inputs_embeds=embeds,
        attention_mask=attention_mask
    )
    x = bert_out.last_hidden_state  # [1, seq, 768]

    x = model.drop(x)
    x, _ = model.bilstm1(x)
    x = model.drop(x)
    x, _ = model.bilstm2(x)
    x = model.drop(x)
    x, _ = model.bilstm3(x)

    x = x.mean(dim=1)
    x = model.ln(x)
    x = model.relu(x)
    x = model.drop(x)
    return model.fc(x)  # [1, 3]


def explain_ig(text: str):
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        max_length=MAX_LEN,
        padding=True
    ).to(DEVICE)

    input_ids = inputs["input_ids"]
    attention_mask = inputs["attention_mask"]

    # Lấy embedding thật và baseline
    with torch.no_grad():
        real_embeds = model.bert.embeddings.word_embeddings(input_ids)  # [1, seq, 768]
        baseline_embeds = torch.zeros_like(real_embeds)

    # Predict class — dùng eval mode
    model.eval()
    with torch.no_grad():
        logits = _forward_from_embeds(real_embeds, attention_mask)
        probs = torch.softmax(logits, dim=-1).squeeze()
        pred_idx = int(torch.argmax(probs))

    # Integrated Gradients
    # cuDNN RNN yêu cầu training mode để chạy backward
    # weights không bị update vì không gọi optimizer
    model.train()

    integrated_grads = torch.zeros_like(real_embeds)

    for step in range(N_STEPS):
        alpha = (step + 1) / N_STEPS
        interp = (baseline_embeds + alpha * (real_embeds - baseline_embeds)).detach().requires_grad_(True)

        logits_step = _forward_from_embeds(interp, attention_mask)
        logits_step[0, pred_idx].backward()

        integrated_grads += interp.grad.detach()
        model.zero_grad()  # xóa grad của weights, không ảnh hưởng kết quả

    integrated_grads /= N_STEPS

    # Về lại eval mode
    model.eval()

    # Attribution = (input - baseline) * integrated_grads
    attributions = (real_embeds.detach() - baseline_embeds) * integrated_grads
    token_attr = attributions.squeeze(0).sum(dim=-1)  # [seq]

    # Gom subword → word, decode đúng emoji/unicode
    input_ids_list = input_ids[0].tolist()
    raw_tokens = tokenizer.convert_ids_to_tokens(input_ids_list)

    special_ids = {
        tokenizer.bos_token_id,
        tokenizer.eos_token_id,
        tokenizer.pad_token_id,
    }

    groups = []
    current_ids, current_attrs = [], []

    for i, (tid, raw_tok) in enumerate(zip(input_ids_list, raw_tokens)):
        if tid in special_ids:
            if current_ids:
                groups.append((current_ids[:], current_attrs[:]))
                current_ids, current_attrs = [], []
            continue

        attr = float(token_attr[i])
        is_new_word = raw_tok.startswith("Ġ") or raw_tok.startswith("▁")

        if is_new_word and current_ids:
            groups.append((current_ids[:], current_attrs[:]))
            current_ids, current_attrs = [], []

        current_ids.append(tid)
        current_attrs.append(attr)

    if current_ids:
        groups.append((current_ids, current_attrs))

    raw_word_attrs = []
    for ids, attrs in groups:
        word = tokenizer.decode(ids, clean_up_tokenization_spaces=False).strip()
        if word:
            raw_word_attrs.append((word, sum(attrs)))

    if not raw_word_attrs:
        return {
            "input_text": text,
            "label": LABELS[pred_idx],
            "confidence": round(float(probs[pred_idx]), 4),
            "ig": []
        }

    # Normalize riêng phần dương và âm về [-1, 1]
    scores = [s for _, s in raw_word_attrs]
    pos_max = max((s for s in scores if s > 0), default=1e-8)
    neg_min = min((s for s in scores if s < 0), default=-1e-8)

    word_list = []
    for word, score in raw_word_attrs:
        if score >= 0:
            normalized = score / pos_max       # [0, 1]
        else:
            normalized = score / abs(neg_min)  # [-1, 0]
        word_list.append({
            "word": word,
            "score": round(float(normalized), 4)
        })

    return {
        "input_text": text,
        "label": LABELS[pred_idx],
        "confidence": round(float(probs[pred_idx]), 4),
        "ig": word_list
    }
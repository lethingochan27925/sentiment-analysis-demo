from pathlib import Path
import torch

BASE_PATH = Path(__file__).parent.parent / "saved_models" / "best_model" / "RoBERTa_3L_base_with_emoji"

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

LABELS = ["negative", "neutral", "positive"]

MAX_LEN = 128
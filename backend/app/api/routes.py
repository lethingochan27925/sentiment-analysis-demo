from fastapi import APIRouter

from app.api.schemas import TextRequest
from app.core.predictor import predict_sentiment
from app.core.xai import explain_attention
from app.core.ig import explain_ig


router = APIRouter()


@router.get("/")
def root():
    return {"message": "Sentiment Analysis API Running"}


@router.post("/predict")
def predict(request: TextRequest):
    return predict_sentiment(request.text)

@router.post("/explain")
def explain(request: TextRequest):
    return explain_attention(request.text)

 
@router.post("/explain_ig")
def explain_ig_route(request: TextRequest):
    return explain_ig(request.text)
 
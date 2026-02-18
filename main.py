import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routes.audio import router as audio_router
from routes.transcribe import router as transcribe_router
from routes.transcript import router as transcript_router

load_dotenv()

app = FastAPI(title="RecordSpeechToTranscript API", version="1.0.0")

# Allow all origins so Expo dev client (any local IP) can connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure output folders exist relative to project root (one level up from backend/)
PROJECT_ROOT = Path(__file__).parent.parent
VOICE_FILES_DIR = PROJECT_ROOT / "Voice Files"
TRANSCRIPT_DIR = PROJECT_ROOT / "The Transcript"
VOICE_FILES_DIR.mkdir(exist_ok=True)
TRANSCRIPT_DIR.mkdir(exist_ok=True)

app.include_router(audio_router)
app.include_router(transcribe_router)
app.include_router(transcript_router)


@app.get("/health")
def health():
    return {"status": "ok"}

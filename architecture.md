# RecordSpeechToTranscript — Architecture

## Overview
Android mobile app (React Native + Expo) that records or uploads audio,
transcribes it locally with Whisper, then cleans the transcript via OpenAI GPT.

---

## System Diagram
```
Android Phone (Expo)
    │
    │  HTTP over local Wi-Fi
    ▼
PC Backend (FastAPI :8000)
    ├── openai-whisper  →  raw transcript
    └── OpenAI GPT API  →  cleaned transcript
         (internet required for GPT step only)
```

---

## Folder Structure
```
RecordSpeechToTranscript/
├── Plan/                     ← you are here
│   └── architecture.md
├── backend/
│   ├── main.py               ← FastAPI app, CORS, router registration
│   ├── requirements.txt
│   ├── .env                  ← OPENAI_API_KEY (never commit this)
│   ├── routes/
│   │   ├── audio.py          ← POST /upload-audio
│   │   ├── transcribe.py     ← POST /extract-text  (Whisper)
│   │   └── transcript.py     ← POST /to-transcript (GPT + save file)
│   └── utils/
│       ├── whisper_helper.py ← load model once at startup, transcribe()
│       └── gpt_helper.py     ← call GPT to clean raw text
├── frontend/
│   ├── App.js                ← root: SafeAreaView with two panels
│   ├── app.json              ← Expo config
│   ├── package.json
│   ├── config.js             ← BASE_URL (edit with your PC's local IP)
│   └── components/
│       ├── VoicePanel.js     ← top half: Record Speech + Upload Audio
│       └── TextPanel.js      ← bottom half: Extract Text + To Transcript
├── Voice Files/              ← audio files saved here by backend
└── The Transcript/           ← cleaned .txt files saved here by backend
```

---

## API Endpoints
| Method | Path | Purpose |
|--------|------|---------|
| GET | /health | Check backend is alive |
| POST | /upload-audio | Save uploaded audio to Voice Files/ |
| POST | /extract-text | Run Whisper on saved audio → return raw text |
| POST | /to-transcript | Send raw text to GPT → clean → save .txt → return |

---

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Android UI | React Native + Expo SDK 51 |
| Audio record | expo-av |
| File picker | expo-document-picker |
| HTTP client | axios |
| Backend API | Python FastAPI + uvicorn |
| Speech-to-text | openai-whisper (local, "base" model) |
| Text cleaning | OpenAI GPT API (gpt-3.5-turbo) |
| Config | python-dotenv (.env file) |

---

## Running the App

### 1. Start the backend (PC)
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Find your PC's local IP
```bash
ipconfig   # look for IPv4 Address, e.g. 192.168.1.42
```

### 3. Update frontend config
Edit `frontend/config.js` → set `BASE_URL` to `http://192.168.1.42:8000`

### 4. Start the Expo app
```bash
cd frontend
npm install
npx expo start
```
Scan the QR code with **Expo Go** on your Android phone (same Wi-Fi).

---

## Notes
- Whisper "base" model (~145 MB) downloads automatically on first run.
- The GPT step requires internet; Whisper step is fully offline.
- For a production APK: `eas build --platform android`

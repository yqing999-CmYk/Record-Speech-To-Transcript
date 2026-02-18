# RecordSpeechToTranscript

Android app to record or upload audio, transcribe with Whisper, and clean the transcript with OpenAI GPT.

---

## Table of Contents
1. [Project Structure](#project-structure)
2. [Tech Stack](#tech-stack)
3. [Daily Use — How to Run](#daily-use--how-to-run)
4. [API Endpoints](#api-endpoints)
5. [Test in Browser](#test-in-browser)
6. [Deployment Options](#deployment-options)
7. [Docker Setup](#docker-setup)
8. [Build Android APK](#build-android-apk)
9. [Troubleshooting](#troubleshooting)

---
## Tech Stack
| Layer | Technology |
|-------|-----------|
| Android app | React Native + Expo SDK 54 |
| Audio record | expo-audio |
| File picker | expo-document-picker |
| HTTP client | axios |
| Backend API | Python FastAPI + uvicorn |
| Speech-to-text (local) | openai-whisper + torch |
| Speech-to-text (cloud) | OpenAI whisper-1 API |
| Text cleaning | OpenAI GPT (gpt-3.5-turbo) |

---

## Daily Use — How to Run

### Prerequisites (one-time setup)
```
• Python 3.11+  installed
• Node.js 18+   installed
• Expo Go app   installed on Android phone
• OPENAI_API_KEY in backend/.env
### Step 1 — Start the backend

**Option A: Double-click** `start_backend.bat` in File Explorer.

**Option B: Terminal**
```bash
cd backend
venv\Scripts\activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Verify it works — open browser: `http://localhost:8000/health`
Should return: `{"status":"ok"}`

### Step 2 — Find your PC's local IP
```bash
ipconfig
# Look for: IPv4 Address . . . 192.168.x.x   (under Wi-Fi adapter)
```

### Step 3 — Set the IP in the frontend
Edit `frontend/config.js`:
```js
const BASE_URL = "http://192.168.x.x:8000";  // ← your actual IP
```

### Step 4 — Start the Expo app
```bash
cd frontend
npm install          # only needed first time or after package changes
npx expo start
```
Open **Expo Go** on your Android phone (must be on same Wi-Fi), scan the QR code.

### Step 5 — Allow Windows Firewall (if phone can't connect)
Run in PowerShell as Administrator:
```powershell
netsh advfirewall firewall add rule name="FastAPI Dev Port 8000" dir=in action=allow protocol=TCP localport=8000
```
## API Endpoints

| Method | Path | Body | Description |
|--------|------|------|-------------|
| GET | `/health` | — | Check backend is alive |
| POST | `/upload-audio` | `multipart: file` | Save audio → `Voice Files/` |
| POST | `/extract-text` | `{filename, mode}` | Whisper transcription → raw text |
| POST | `/to-transcript` | `{raw_text, filename}` | GPT clean → save `.txt` → `The Transcript/` |

**`mode` values for `/extract-text`:**
- `"local"` — uses local openai-whisper model on your PC (free, no internet needed)
- `"api"` — uses OpenAI whisper-1 API (faster, costs ~$0.006/min, needs internet)

---
**use Docker Compose** — create `docker-compose.yml` at the project root:
```yaml
version: "3.9"
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - WHISPER_MODEL=base
    volumes:
      - ./Voice Files:/Voice Files
      - ./The Transcript:/The Transcript
    restart: unless-stopped
```

```bash
# Start
docker compose up -d

# Stop
docker compose down

# View logs
docker compose logs -f backend
```

> Note: To use **local Whisper** inside Docker, the `torch` + `openai-whisper` packages add ~3GB to the image. If you only use the Whisper API mode, remove `openai-whisper` and `torch` from `requirements.txt` to keep the image small (~200MB).

---

```


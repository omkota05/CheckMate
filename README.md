# Sentinel Split

![Python](https://img.shields.io/badge/Python-3.11-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-backend-blue) ![React](https://img.shields.io/badge/React-TypeScript-green) ![Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-orange)

Receipt-splitting app built at a hackathon. Photograph or upload a receipt → AI parses and heals the abbreviated item names → assign items to friends → settle up via Venmo.

## How it works

```
1. POST /scan  → Gemini Vision parses receipt items
2.              → Gemini text call expands OCR abbreviations instantly
3. POST /heal-batch → Browser Use verifies against live restaurant menu
4. User assigns items → Settlement → Venmo links
```

## Features

- **Two-stage name healing** — Gemini expansion for instant display, Browser Use for verified accuracy
- **Batch browser sessions** — items chunked into groups of 3; one browser lifecycle per chunk instead of per item (~3× fewer sessions)
- **Guard logic** — rejects results where the agent echoed back unchanged abbreviated text
- **Graceful fallback** — if Browser Use fails or times out, Gemini-expanded names are used
- **Venmo settlement** — copyable `venmo.com` web links with pre-filled amount and charge request

## Tech stack

- **Backend** — Python, FastAPI, Gemini Vision API, Gemini 2.5 Flash, Browser Use
- **Frontend** — React, TypeScript, Vite, Zustand, Tailwind CSS

## Getting started

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
npm install
npm run dev
```

Set your `GEMINI_API_KEY` in a `.env` file in the `backend/` directory.

## Configuration

- `BATCH_CHUNK_SIZE = 3` in `main.py` — tune up or down based on agent reliability
- Browser Use timeout: 150s per chunk (adjustable in `healer.py`)
- Fetch timeouts: 30s scan, 120s heal, 150s batch (set in `api.ts`)

## Repo

Active development is on the `browser-use` branch.



# Wire Frontend to FastAPI Backend

## Summary
Replace the mock data simulation with real `fetch` calls to your teammate's FastAPI `POST /scan` endpoint. When a user uploads/scans a receipt image, the frontend will send it to FastAPI, receive parsed items with confidence scores, and display them — no more hardcoded demo data.

## Backend Response Shape (from `scanner.py`)
```json
{
  "restaurant": "...",
  "items": [
    {"name": "Chicken Tacos", "price": 14.50, "confidence": 0.85, "needs_healing": true}
  ],
  "tax": 5.82,
  "tip": 13.90,
  "total": 89.72
}
```

## Changes

### 1. Add API config (`src/lib/api.ts` — new file)
- Export a `FASTAPI_BASE_URL` constant (default `http://localhost:8000`)
- Export a `scanReceiptAPI(file: File)` function that:
  - Creates `FormData` with the image file
  - Calls `POST {FASTAPI_BASE_URL}/scan`
  - Maps the response to the frontend `Receipt` interface (e.g. `name` → `original_ocr_name`, `confidence` → `confidence_score`, `needs_healing` → status)
  - Returns a fully shaped `Receipt` object ready for the store

### 2. Add `scanReceipt` action to store (`src/lib/store.ts`)
- New async action: `scanReceipt(file: File)` that:
  - Sets agent message to "Scanning receipt..."
  - Calls `scanReceiptAPI(file)` from the new api module
  - On success: sets `currentReceipt` with the mapped data, updates agent feed with item results
  - On error: adds an error agent message, falls back to demo simulation so the app still works during development
- Keep `startHealingSimulation` intact for the demo button

### 3. Update `CommandCenter.tsx` — wire scan button
- In `handleFileChange`: call the new `scanReceipt(file)` instead of `startHealingSimulation()`
- Keep the "Run Demo Simulation" button still using `startHealingSimulation` for testing without backend
- Navigate to group tab after scan completes

### 4. Response mapping detail
| Backend field | Frontend field | Transform |
|---|---|---|
| `restaurant` | `restaurant_name` | Direct |
| `items[].name` | `original_ocr_name` | Direct |
| `items[].price` | `price` | Direct |
| `items[].confidence` | `confidence_score` | Direct |
| `items[].needs_healing` | `status` | `true` → `'low_confidence'`, `false` → `'verified'` |
| `tax` | `tax` | Direct |
| `tip` | `tip` | Direct |
| — | `assigned_to` | Default `[]` |
| — | `healed_name` | Default `null` |

### What stays the same
- `ReceiptHealer.tsx` — already renders dynamically from store
- `Settlement.tsx` — already reads from store
- Demo button — still works with mock data for testing without backend
- All `// TODO [BACKEND]` notes preserved and updated where relevant




# Update FastAPI Base URL

## Summary
One-line change: update `FASTAPI_BASE_URL` in `src/lib/api.ts` from `http://localhost:8000` to the deployed ngrok URL.

## Change

**`src/lib/api.ts` (line 2)**
```ts
// Before
export const FASTAPI_BASE_URL = 'http://localhost:8000';

// After
export const FASTAPI_BASE_URL = 'https://kimberlee-unlucent-noneagerly.ngrok-free.dev';
```

That's it. The `scanReceipt` store action and `CommandCenter` file upload handler are already wired to call `POST {FASTAPI_BASE_URL}/scan`. Once the URL points to the live server, uploading a receipt image will hit the real backend. If the backend is down, the existing `catch` block falls back to demo data automatically.


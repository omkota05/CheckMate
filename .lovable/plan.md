

# Fix ngrok "Failed to fetch" — Add Required Header

## Problem
The fetch to `https://kimberlee-unlucent-noneagerly.ngrok-free.dev/scan` fails with "Failed to fetch" before even getting a response. This happens because **ngrok free tier serves an interstitial warning page** for requests that don't include a specific header. The browser's CORS preflight (OPTIONS request) hits this interstitial instead of the FastAPI CORS response, causing the entire request to be blocked.

## Fix
Add the `ngrok-skip-browser-warning` header to the fetch call in `src/lib/api.ts`. This tells ngrok to pass the request straight through to your FastAPI server.

### Change in `src/lib/api.ts`
Update the fetch call (line 25-28) to include the ngrok header:

```ts
const res = await fetch(`${FASTAPI_BASE_URL}/scan`, {
  method: 'POST',
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
  body: formData,
});
```

That's it — one header addition. The backend CORS config already allows all origins/headers, so once ngrok stops intercepting, the request will go through to FastAPI normally.

## Why this works
- ngrok free tunnels show a "Visit Site" interstitial page to browser requests
- This interstitial doesn't respond to CORS preflight correctly
- The `ngrok-skip-browser-warning` header bypasses it entirely
- Your FastAPI backend already has `allow_headers=["*"]` so it will accept this extra header


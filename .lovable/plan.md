

# Integrate POST /heal for Low-Confidence Items

## Summary
After scanning a receipt, automatically call `POST /heal` for every item where `needs_healing` is true. Update each item's display with the returned `verified_name`, marking it as verified.

## Changes

### 1. `src/lib/api.ts` — Add `healItemAPI` function

```ts
export async function healItemAPI(item_name: string, restaurant_name: string): Promise<string> {
  const res = await fetch(`${FASTAPI_BASE_URL}/heal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
    body: JSON.stringify({ item_name, restaurant_name }),
  });
  if (!res.ok) throw new Error(`Heal error: ${res.status}`);
  const data = await res.json();
  return data.verified_name;
}
```

### 2. `src/lib/store.ts` — Call `/heal` after scan completes

In the `scanReceipt` action, after setting the receipt and logging items, loop through items with `status === 'low_confidence'` and call `healItemAPI` for each. On success, update that item's `healed_name`, `confidence_score`, and `status` to `'verified'`. Log each healing step to the agent feed.

```ts
// After setting receipt and logging items:
const itemsToHeal = receipt.items.filter(i => i.status === 'low_confidence');
for (const item of itemsToHeal) {
  addAgentMessage({ message: `Healing: "${item.original_ocr_name}"...`, type: 'searching' });
  try {
    const verifiedName = await healItemAPI(item.original_ocr_name, receipt.restaurant_name);
    addAgentMessage({ message: `Healed: ${item.original_ocr_name} → ${verifiedName}`, type: 'healed' });
    // Update item in store
    set(state => ({
      currentReceipt: state.currentReceipt ? {
        ...state.currentReceipt,
        items: state.currentReceipt.items.map(i =>
          i.id === item.id ? { ...i, healed_name: verifiedName, confidence_score: 0.98, status: 'verified' } : i
        ),
      } : null,
    }));
  } catch {
    addAgentMessage({ message: `Could not heal "${item.original_ocr_name}"`, type: 'idle' });
  }
}
```

After all healing is done, update receipt status to `'healed'` and log "All items verified."

### 3. No UI changes needed
`ReceiptHealer.tsx` already displays `healed_name` when present and shows the "Agent Verified" badge for `status === 'verified'` items — the healing results will appear automatically.


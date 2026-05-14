## Goal
Make `/ai-interview-pro` reliably load and start a session for end users. In my own browser test the page renders and the AI streams a question, which means the bug is environment-dependent (auth session missing, streaming fragile, or permissions blocking). The plan hardens the load/start path so it works for real users.

## Root causes to fix

1. **Auth fallback uses publishable key as Bearer.**
   `AIInterviewPro.tsx` line 38 falls back to `VITE_SUPABASE_PUBLISHABLE_KEY` when there is no session. The `ai-interview` edge function calls `supabase.auth.getClaims(token)` and rejects anon keys → first call fails silently and the chat hangs at the empty placeholder. Users on a freshly-loaded protected route can hit this when the session token isn't refreshed yet.

2. **Streaming parser can stall.**
   Lines 80–93: when a JSON chunk is split mid-line, the catch block prepends the partial line back to `buffer` and `break`s the inner loop, but the outer `while` re-reads and re-decodes — fine. However if the very last `data:` line in a chunk isn't terminated by `\n`, it is never processed, so the assistant message stays empty even after `[DONE]`. This presents to the user as "Start Interview did nothing".

3. **No visible error state on failure.**
   The empty assistant placeholder is filtered out on error, but the only feedback is a `toast` that's easy to miss. After a failed start the UI still says "Ready" with no question and the Start button is gone, so it looks broken.

4. **Start button can be obscured at narrow viewports.**
   The 3-column topbar has `Start Interview` on the right, but at <1100px it overlaps the centered subtitle on some setups. Worth confirming with a small layout fix.

5. **Webcam/mic permission errors block perception of "started".**
   `useWebcam` runs as soon as `started` flips true. If the user denies permission the camera tile turns red and many users read that as the whole feature being broken.

## Changes

### `src/modules/ai-interview-pro/AIInterviewPro.tsx`
- Remove the publishable-key fallback; if `session?.access_token` is missing, redirect to `/auth?redirect=/ai-interview-pro` with a toast explaining re-login.
- Flush remaining `buffer` after the read loop ends (parse any trailing `data:` line).
- Track a `startError` state. If the first AI call fails, show an inline retry card in the center panel instead of leaving an empty chat.
- Show a non-blocking explainer when camera/mic is denied: "Proctoring disabled — interview will continue."

### `src/modules/ai-interview-pro/components/CenterPanel.tsx`
- Add an `error?: string` + `onRetry?: () => void` prop and render a retry card when set.
- Keep the streaming "thinking" indicator visible while `streaming && messages[last].content === ""` so users know something is happening.

### `src/modules/ai-interview-pro/AIInterviewPro.module.scss`
- Make the topbar `grid-template-columns: auto 1fr auto` and hide the centered subtitle below 900px so the Start button never overlaps.

### `supabase/functions/ai-interview/index.ts` (verify only, no behavior change)
- Confirm CORS + 401 path returns JSON so the client can show a clear "Session expired, please log in again" message. Adjust error body if needed.

## Out of scope
- Category routing into the prompt (separate request).
- Webcam face-detection accuracy.
- Saving interview history.

## Verification
1. Open `/ai-interview-pro` logged in → click Start → first question streams in within a few seconds.
2. Open `/ai-interview-pro` with an expired session → redirected to `/auth` with toast.
3. Force the edge function to 500 (temporary) → inline retry card appears, Retry recovers.
4. Deny camera permission → interview still starts, left panel shows "Proctoring disabled".
5. Resize to 800px wide → Start button remains clickable, no overlap.

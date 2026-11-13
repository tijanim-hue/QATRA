# QATRA AI backend - Groq source preparation, not deployed

Use tijanim-hue/QATRA, branch mindful/phase-2-ai, Root Directory server. This folder is not on main. Do not merge the entire branch merely to deploy the server. Android/app files are unchanged. Node 22; existing pinned jose 6.2.17; no new SDK dependency.

## Provider and budget
/api/mindful now imports groq.js only. No automatic OpenAI or paid-provider fallback; openai.js remains inactive legacy source. Configure AI_PROVIDER=groq and GROQ_MODEL=openai/gpt-oss-20b. The allowlist also permits openai/gpt-oss-120b. The openai/ prefix names the open-weight model, not the API provider.
Strict JSON Schema: https://console.groq.com/docs/structured-outputs
Free quotas: https://console.groq.com/docs/rate-limits
Keep Groq on Free; do not add a payment method or upgrade. The server cannot verify billing tier. Request-count quotas do NOT guarantee zero spending if a service plan changes. Do not provision paid hosting, identity or Redis without separate approval. No automatic retries are added. Enable ZDR in Groq account settings; the code does not configure or verify provider retention. No live personal journal data during setup.

## Mandatory activation gates
Keep AI_ENABLED=false. Adding GROQ_API_KEY alone is NOT sufficient. Secrets belong only in hosting settings, never Git, chat, logs or the APK.
- OIDC issuer/audience/JWKS and real app sign-in with verified RS256 JWTs. No bundled bearer secret. Revocation/attestation remain unimplemented.
- Durable Upstash Redis REST credentials and shared atomic quotas that fail closed. Counters store rotating HMAC pseudonyms/counts, not journal text. Redis provisioning and free-plan suitability remain unverified.
- Groq Free account with ZDR, server-only key and allowed model.
- Random RATE_LIMIT_HMAC_KEY of at least 32 characters and exact ALLOWED_ORIGINS including the actual Capacitor origin. CORS is not authentication. IP quotas require Vercel forwarding headers.
- App implementation of cloud consent qatra-ai-v1 and separate selected-history permission. The server cannot prove UI consent. Separate preview/production secrets and quotas as appropriate.

## Verification and limits
GET /api/health checks process health only. POST /api/mindful accepts feelings or thought. Existing input limits and reply validation remain; Groq reads at most 128 KiB with a 20-second timeout. Incomplete, refused, rate-limited or malformed responses fail explicitly. No tools, remote journal access, body logging or conversation database are added. Render strings with textContent, not innerHTML. Keep the existing local fallback.
Dependency installation, CI results, deployment, real OIDC, Redis, live Groq quality and mobile integration remain unverified. npm run check performs syntax checks, not functional tests. No live model calls have been made in this migration. This commit does not connect the Android UI or complete phase 2.

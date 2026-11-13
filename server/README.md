# QATRA AI backend — phase 2, not yet deployed

Deploy this directory as a separate Vercel project (Root Directory: server), not as the Android public directory. Main/app code is unchanged. Node 22 and pinned jose 6.2.17 are used. No shared secret belongs in the APK.

## Routes
- GET /api/health: process health only, not proof that AI/auth/Redis work.
- POST /api/mindful: activities feelings or thought only. Requires a verified RS256 OIDC JWT, explicit cloud consent policy qatra-ai-v1, separate history permission when records are included, and a successful shared Redis quota reservation.

## Activation requirements
Set secrets in hosting settings, never in Git, chat or public files. .env.example contains names only. Keep AI_ENABLED=false until all requirements are provisioned:
1. Choose and provision an OIDC identity project; configure issuer, audience and JWKS. The app still needs a real sign-in/token flow; a bundled bearer key is not acceptable. Revocation/attestation are not implemented here; tokens expire and quotas are a separate abuse control.
2. Provision a durable Upstash Redis database and server-only REST credentials. No temporary database is created. Counters store rotating HMAC pseudonyms and counts, not journal text. Reservations are atomic and failures block model calls. Limits are request counts, NOT a monetary billing guarantee; configure provider spending controls separately.
3. Configure an OpenAI project key and a compatible Responses/structured-output model via OPENAI_MODEL. Model selection and cost approval remain pending. No live API calls have been made.
4. Set a random RATE_LIMIT_HMAC_KEY of at least 32 characters and exact ALLOWED_ORIGINS, including the actual Capacitor origin. CORS is not authentication. IP quotas trust Vercel forwarding headers and require the Vercel environment.
5. Deploy disabled, verify the routes, then integrate explicit consent and identity in the app before activation. Separate preview/production credentials and quotas where appropriate.

## Privacy and limits
Only the submitted text, at most six current-session turns and three selected records are forwarded. The server cannot prove the UI collected consent; the client implementation is a remaining mandatory gate. No database of personal conversations, request-body logging or automatic retries is added. Platforms/providers have their own logging and retention policies: store:false is NOT a zero-retention guarantee. Responses are JSON and must be rendered with textContent, never innerHTML.

Input: 32 KiB JSON, text at most 6000 characters, combined context at most 14000 characters. Output is bounded and validated. Timeout/provider refusal/incomplete output produces an explicit error; the client must offer the existing local mode, not pretend a remote reply succeeded. No tools or remote journal access are enabled.

## Evidence / remaining phase 2 work
JS syntax was checked locally only. Dependency install, deployment, actual OIDC verification, Redis execution, live model behavior and mobile integration are NOT verified. CI performs dependency install and syntax/import checks, not functional tests, following the user decision. Backend source readiness is not completion of phase 2: existing feelings/thought UI and local fallback are unchanged and not connected to this endpoint yet.

# DonorDash

DonorDash is a MERN emergency blood donor matching application. It helps a requester create a time-sensitive blood request and helps eligible donors respond without exposing private contact details prematurely.

## Technology stack

- Frontend: React, Vite, Tailwind CSS, Redux Toolkit, React Router, Axios, Socket.IO Client
- Backend: Node.js, Express.js, REST APIs, Socket.IO
- Database: MongoDB Atlas with Mongoose
- Authentication: JWT, HTTP-only cookies, bcrypt, CORS
- Deployment: Vercel frontend, Render backend

## Project structure

```text
client/
  index.html               Vite entry document
  vite.config.js           Vite + React configuration
  src/
    components/            shared UI primitives
    features/requests/     blood-group rules and request data
    pages/                 overview, requests, create request, profile
    App.jsx                routing, orchestration, API synchronization
server/
  models/                  one Mongoose model per domain entity
  logic.js                 eligibility and matching service
  mailer.js                notification service
  index.js                 API and Socket.IO composition
```

## What is implemented

- React + Tailwind CSS frontend with a responsive dashboard, forms, validation messages, empty states, and mobile layout.
- Express + MongoDB/Mongoose backend with User, DonorProfile, BloodRequest, and DonorResponse models.
- Donor profile with blood group, city, state, gender, date of birth, last donation date, and availability toggle.
- Urgent blood request workflow with hospital, city, state, units, deadline, duplicate-request protection, and compatibility preview.
- Eligibility logic: same-city-and-state matching, compatible red blood cell groups, age 18-65, and configurable donation gap (90 days for men, 120 days for women).
- Request lifecycle with open, partially filled, fulfilled, and decline paths.
- Atomic-style fulfilment guard in the client workflow so a request cannot accept responses after its units are covered.
- Privacy-aware UI: phone details are not publicly shown and the requester only sees a donor as accepted after consent.
- JWT authentication in an httpOnly cookie, bcrypt password hashing, Zod validation, and rate limiting.
- Secure password reset with one-time SHA-256-hashed tokens that expire after 30 minutes; reset requests return the same message whether an email exists or not.
- Donor safety controls with a health disclaimer, report storage, and blocking that excludes blocked donors from future matches.
- Frontend request expiry labels update every 30 seconds, even before the scheduled backend expiry job runs.
- Persistent MongoDB data with a localStorage demo fallback when the API is not available.
- Atomic accept protection using a conditional MongoDB update, email notification adapter, and node-cron expiry job.

## Engineering-depth coverage

| Requirement | DonorDash implementation |
| --- | --- |
| Authentication and authorization | JWT in an HTTP-only cookie, bcrypt, protected ownership queries, and role field for future admin controls |
| Persistent data and state management | MongoDB/Mongoose persistence plus Redux Toolkit state and local demo persistence |
| Search, filtering, and recommendations | Blood-group compatibility, city/state matching, age/donation-gap eligibility, and longest-wait ranking |
| User-generated content | Requesters create and update urgent blood requests |
| Real-time communication | Socket.IO broadcasts request creation and cancellation updates |
| Notifications | Nodemailer adapter with safe development logging and failure isolation |
| Background jobs and scheduling | node-cron expires overdue requests every 10 minutes |
| Data synchronization and offline fallback | Axios API hydration, Socket.IO updates, and localStorage demo mode when the API is unavailable |
| Analytics | Dashboard counters for open requests, supported lives, readiness, and response progress |
| Caching and queues | Local client persistence; notification work is isolated with `Promise.allSettled` so email failures do not break request creation |
| Geolocation, uploads, media processing, and collaboration | Intentionally out of scope: city-level matching is safer and sufficient for this workflow; the product does not require media or file uploads |

## Error handling coverage

- Invalid input: frontend form validation and backend Zod schemas return clear 400 responses.
- Failed network/API calls: Axios errors fall back to local demo mode and surface a user-facing toast where appropriate.
- Unauthorized operations: JWT middleware returns 401; ownership filters prevent viewing or cancelling another user's request.
- Missing resources: request and donor endpoints return 404 with a clear message.
- Duplicate responses: the unique request/donor index and response-status guard return 409.
- Fulfilled or expired requests: conditional atomic update returns 409 instead of over-confirming units.
- Database errors: centralized Express error middleware returns a safe 500 response and logs server diagnostics.
- Email failures: notification errors are logged and isolated; the blood request remains active for retry/batch processing.
- Invalid application states: deadline validation, lifecycle enums, status guards, and request ownership checks prevent invalid transitions.

MongoDB relationships are represented with Mongoose references: `DonorProfile.user` points to `User`, `BloodRequest.requester` points to `User`, `BloodRequest.matchedDonors` points to `DonorProfile`, and `DonorResponse` links a request to a donor. Compound indexes support city/blood-group matching, requester history, expiry scans, and the unique request/donor response rule. Queries use `populate`, projections, `lean`, ownership filters, and a conditional atomic update for fulfilment.

## Run locally

```bash
npm install
npm run dev
```

To add demo donor records to MongoDB for local testing, run this once from the project root:

```bash
npm run seed
```

Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`. `npm run dev` starts Vite and the Express API together. MongoDB must be running locally or supplied through MongoDB Atlas. If the API cannot connect, the frontend remains usable in local demo mode.

For Vercel, set `VITE_API_URL` to the Render API URL. For Render, use the included `render.yaml` and set `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL`.
Production startup fails fast unless `MONGO_URI`, `CLIENT_URL`, and a JWT secret of at least 32 characters are present.

## Deployment guide

1. Create MongoDB Atlas database access credentials and add `0.0.0.0/0` to Network Access, or restrict it to the Render outbound IP range when available. Copy the Atlas connection string into Render as `MONGO_URI`.
2. Create a Redis Cloud database and copy its TLS connection URL into Render as `REDIS_URL`. Redis is optional; the API continues without caching if it is unavailable.
3. Create a Render Web Service from this repository. The included `render.yaml` uses `npm install` and `npm run server`. Set `MONGO_URI`, a random `JWT_SECRET` of at least 32 characters, the Vercel URL as `CLIENT_URL`, and the Redis/SMTP variables.
4. Confirm the backend at `https://<render-service>.onrender.com/api/health`. It should return `{ "ok": true }`.
5. Import the repository into Vercel. The included `vercel.json` builds from the project root and serves `client/dist`. Set `VITE_API_URL` to the complete Render API origin, without a trailing slash, then redeploy.
6. Update Render `CLIENT_URL` to the exact Vercel production URL and redeploy the backend. This is required for CORS, cookies, Socket.IO, and password-reset links.
7. Test in an incognito window: register, save a profile, create a request, verify the bell notification, test password reset, and confirm that opening `/profile` while logged out shows the login screen.

`.env.example` documents every local variable. Never commit `.env`, MongoDB credentials, Redis URLs, SMTP passwords, or JWT secrets.

## Security notes

- Secrets are loaded from environment variables and `.env` files are ignored by Git.
- Passwords are hashed with bcrypt; `passwordHash` is excluded from normal Mongoose queries and selected only for login verification.
- JWTs are stored in HTTP-only cookies. Production uses `Secure` + `SameSite=None` so the Vercel frontend can authenticate with the Render API.
- CORS is restricted to `CLIENT_URL`, Helmet adds security headers, JSON payloads are capped at 20 KB, and API requests are rate-limited.
- Zod validates authentication, profile, request, and response payloads before database writes.
- Private request access is protected by JWT authentication plus requester ownership filters; donor contact details are not exposed before acceptance.

For a production deployment, set `NODE_ENV=production`, `CLIENT_URL`, a strong `JWT_SECRET`, and SMTP credentials. The development demo-login route is disabled in production.

Password reset requires the optional SMTP variables in `.env` (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, and `SMTP_PASS`). Without SMTP in development, the reset link is printed only to the server console for local testing. Never enable that development behavior in a public production deployment.

## Product context

DonorDash is intentionally focused on targeted, eligibility-checked matching rather than a public directory where families must call everyone. This gives the application meaningful workflow logic while keeping contact information private.

## End-term readiness checklist

- [x] Connect authentication and persistent backend storage.
- [x] Add server-side rate limiting and authorization.
- [x] Add email notification adapter and scheduled expiry job.
- [ ] Deploy frontend and backend and verify links in an incognito window.
- [ ] Record the 3-5 minute demo and submit the repository, deployment, README, and video before 27 October 2026, 11:59 PM IST.

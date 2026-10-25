# DonorDash

DonorDash is a blood-donation coordination platform that connects blood requesters with eligible local donors while protecting contact information until a donor accepts a request.

## Problem statement

During urgent blood shortages, requesters often depend on scattered phone calls, social-media posts, and unverified donor lists. This makes it difficult to find compatible donors quickly, track multiple units, and coordinate safely.

## Target users

- People requesting blood for themselves or someone in their care.
- Blood donors who want to receive compatible, local requests.
- Hospitals or care centres used as the donation coordination location.

## Solution

A requester submits the blood group, number of units, hospital or care-centre name, location, and deadline. DonorDash matches the request with donors who have a compatible blood group, live in the same city and state, meet the age and health requirements, and have completed the required donation gap.

Donors receive private notifications and choose whether to help. Contact details are shared only after acceptance. The workflow then records arrival, donation completion, and requester or hospital verification. Verified units update request progress and the donor’s last donation date.

## Key features

- Account registration as a donor, requester, or both.
- Donor profile with blood group, gender, date of birth, location, availability, health confirmation, and last donation date.
- Blood-group compatibility matching for red blood cell donations.
- Same-city-and-state donor matching.
- Age 18–65 and donation-gap eligibility checks.
- Configurable donation gap: 90 days for male/other donors and 120 days for female donors.
- Donor matching notifications through Socket.IO and the in-app notification bell.
- Requester workflow for open, partially fulfilled, fulfilled, expired, and cancelled requests.
- Multi-unit requests with hospital/requester verification of the actual donated quantity.
- Automatic donor last-donation-date update after verified donation.
- Next eligible donation date, remaining-day countdown, and eligibility notification.
- Donor workflow: accept, arrive, report donation completed, or decline.
- Contact sharing only after donor acceptance.
- Donor report and block controls.
- Password reset with expiring, one-time tokens.
- MongoDB persistence with Redis caching when configured.
- Responsive React dashboard for desktop and mobile screens.

## Tech stack

- Frontend: React, Vite, React Router, Redux Toolkit, Axios, Socket.IO Client, Tailwind CSS utilities and custom CSS.
- Backend: Node.js, Express.js, REST APIs, Socket.IO, Zod, node-cron, Nodemailer.
- Database: MongoDB with Mongoose; MongoDB Atlas for production.
- Cache: Redis, optional in development and used by the deployed backend when configured.
- Authentication: JWT stored in an HTTP-only cookie and bcrypt password hashing.
- Deployment: Vercel for the frontend and Render for the backend.

## Architecture

```text
React/Vite frontend (client/)
  ├─ Redux state, pages, forms, notification panel
  ├─ Axios REST requests
  └─ Socket.IO client for live notifications and request updates
           │ HTTPS / WebSocket
           ▼
Express API and Socket.IO server (server/)
  ├─ Authentication and authorization middleware
  ├─ Donor, request, notification, safety, and dashboard routes
  ├─ Matching and donation-gap eligibility logic
  ├─ Background jobs for request expiry and eligibility reminders
  └─ Notification service and optional email adapter
           │
           ├─ MongoDB/Mongoose: users, profiles, requests, responses, notifications
           └─ Redis: donor-match cache
```

The main data relationships are:

- `DonorProfile.user` → `User`
- `BloodRequest.requester` → `User`
- `BloodRequest.matchedDonors` → `DonorProfile`
- `DonorResponse` → one request and one donor profile
- `Notification.user` → the recipient user

## Local setup

### Requirements

- Node.js 18 or newer.
- MongoDB locally or a MongoDB Atlas connection string.
- Redis is optional; the app continues without it.

### Install and configure

```bash
git clone https://github.com/TheTaheer1/DonorDash.git
cd DonorDash
npm install
cp .env.example .env
```

Edit `.env` with the required values, then start the frontend and backend together:

```bash
npm run dev
```

The frontend runs at `http://localhost:5173`. The API runs at the `PORT` configured in `.env` (the example uses `5001`).

Useful commands:

```bash
npm run server    # backend only
npm run build     # production frontend build
npm run preview   # preview the frontend build
npm run seed      # optional local demo seed data
```

If MongoDB is unavailable, the frontend can use its local demo fallback, but real authentication, matching, notifications, and persistence require the API and database.

## Environment variables

Copy `.env.example` to `.env`. Never commit `.env` or real credentials.

| Variable | Required | Description |
| --- | --- | --- |
| `NODE_ENV` | Production | Set to `production` on Render. |
| `PORT` | No | Backend port; Render provides this automatically. |
| `MONGO_URI` | Yes | MongoDB connection string. |
| `JWT_SECRET` | Yes | Random secret of at least 32 characters. |
| `CLIENT_URL` | Yes | Exact frontend origin used for CORS and cookies. |
| `VITE_API_URL` | Frontend production | Backend origin, without a trailing slash. |
| `REDIS_URL` | No | Redis connection URL for donor-match caching. |
| `DONATION_GAP_MALE_DAYS` | No | Defaults to `90`. |
| `DONATION_GAP_FEMALE_DAYS` | No | Defaults to `120`. |
| `SMTP_HOST` | No | SMTP host for email delivery. |
| `SMTP_PORT` | No | SMTP port, normally `587`. |
| `SMTP_USER` | No | SMTP username. |
| `SMTP_PASS` | No | SMTP password. |

Production startup fails if `MONGO_URI`, `CLIENT_URL`, or a sufficiently long `JWT_SECRET` is missing. SMTP is optional; without it, development notification links are logged by the server instead of emailed.

## Deployment

### Live application

- Frontend: [donordash-blood-network.vercel.app](https://donordash-blood-network.vercel.app/)
- Backend health check: [donordash-api.onrender.com/api/health](https://donordash-api.onrender.com/api/health)
- Source repository: [github.com/TheTaheer1/DonorDash](https://github.com/TheTaheer1/DonorDash)

### Vercel frontend

1. Import the GitHub repository into Vercel.
2. Set `VITE_API_URL` to `https://donordash-api.onrender.com`.
3. Build the project using the repository’s `vercel.json` configuration.
4. Deploy and copy the final Vercel URL into Render’s `CLIENT_URL`.

### Render backend

1. Create a Render Web Service from the GitHub repository, or use the included `render.yaml` Blueprint.
2. Use `npm install` as the build command and `npm run server` as the start command.
3. Configure `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, and optionally `REDIS_URL` and SMTP variables in Render Environment.
4. Add the Render service’s outbound access in MongoDB Atlas Network Access. For development, `0.0.0.0/0` permits all IP addresses; production deployments should restrict access where possible.
5. Confirm deployment with `/api/health`; a healthy response is `{ "ok": true, "service": "DonorDash API" }`.

After deployment, test registration, profile saving, donor matching, live notifications, partial fulfilment, verification, donation-gap blocking, password reset, and logged-out route protection.

## Security and privacy

- Passwords are hashed with bcrypt.
- JWTs use HTTP-only cookies.
- CORS is restricted to `CLIENT_URL`.
- Helmet, rate limiting, JSON size limits, and Zod validation protect the API surface.
- Request ownership checks prevent users from viewing or changing another user’s request.
- Donor contact details are not exposed before the donor accepts.
- Health eligibility is used for matching and is not shown publicly.
- Do not commit MongoDB, Redis, SMTP, or JWT secrets.

## Project structure

```text
client/
  src/components/       Shared UI components
  src/features/         Blood-group and request constants
  src/pages/            Dashboard, request, profile, auth, and match pages
  src/App.jsx           Client orchestration, routing, and live updates
server/
  models/               Mongoose domain models
  routes/               API route modules
  logic.js              Matching and eligibility logic
  services/             Cache and notification services
  index.js              Express, Socket.IO, cron jobs, and startup
render.yaml              Render deployment configuration
vercel.json              Vercel frontend configuration
.env.example             Safe environment-variable template
```

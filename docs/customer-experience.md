# Customer experience features

## Free website guide

The chat widget calls `POST /api/guide`. It searches published service pages only, returns service details and links, and retains the selected service for follow-up questions. Publishing updated service content updates its source material without a deployment. Questions are processed by this server and are not stored by the application. This is keyword-based retrieval, not a generative AI assistant. No AI provider is configured and no provider fees are incurred. It does not claim a live agent, invent quotes or confirm timelines.

## Self-service and booking

Visit `/portal` to submit a project request, optionally with a preferred 30-minute consultation time. Save the returned request ID and private access code. The raw access code is returned once; only its SHA-256 digest is stored. Status lookup requires both values in a POST body, not a public URL. Contact details and project messages are never returned by public status lookup.

Administrators use **Admin → Requests** to review project requests, update the customer-visible status, and confirm or cancel consultations. A booking begins as **requested**, not confirmed. Confirmation serializes scheduling changes and rejects overlapping confirmed 30-minute appointments. Dates are stored as UTC timestamps and shown in each viewer's device timezone. Confirmed appointments provide an ICS calendar download in the portal.

This release does not send emails, create video meeting links, synchronize an external calendar, or provide automatic reminders. The team must contact the client for meeting arrangements. Automatic booking against a connected calendar requires a selected provider and authorization.

## Architecture and protections

The existing React frontend and Express JSON API run on Render with PostgreSQL in production. Local development uses SQLite. Durable requests and appointments live in the database, so restarts do not lose them. New tables are created idempotently at startup: service_requests, appointment_requests and scheduling_lock.

Public responses receive Helmet security headers. Portal and guide endpoints have payload validation, size limits, rate limits, same-origin checks and no-store responses. Admin operations retain authentication, role checks and CSRF checks. Database statements use bound parameters. Portal access codes are generated from 32 random bytes. These controls are not a penetration test or a guarantee against every attack.

Dark mode is a visitor preference saved in local storage. Motion respects reduced-motion preferences. The current logo and public page layouts are retained.

Validation: automated coverage for request privacy, incorrect access codes, admin access, CSRF, concurrent appointment conflicts, invalid dates, guide context and published-only content. Browser checks cover request creation/status lookup, responsive chat, service responses and dark mode. PostgreSQL-specific tests require a configured test database.

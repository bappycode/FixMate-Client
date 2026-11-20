# FixMate (Client)

FixMate is a repair-service booking platform. Customers find a technician for a phone, laptop or home appliance, send a repair request, follow the job step by step, and pay online once the work is done. Technicians list services and manage requests. Admins approve services and oversee the platform.

This repository is the **Next.js client**. The REST API lives in the [FixMate Server](https://github.com/bappycode/FixMate-Server) repository.

- **Live site:** https://fixmate-client-peach.vercel.app
- **API:** https://fixmate-server-neon.vercel.app

## Features

**Public**
- Home page with featured services, categories, how it works and a call to action
- Browse services with search, category and service-mode filters, sorting (newest, price) and server-side pagination (12 per page). All of it lives in the URL, so links can be shared
- Service details page and a request form for customers
- "How It Works" page

**Customer**
- Send a repair request and cancel it while it is still waiting for the technician
- "My Bookings" with a job timeline that shows when every step happened
- Pay with Stripe Checkout once the job is completed, with a payment history
- Overview with a chart of requests by status

**Technician**
- Add, edit, delete and switch services on or off (a new or edited service waits for admin approval)
- Accept or reject requests, then move each job to in progress and completed with a final amount
- Overview with charts of requests by status and services by approval

**Admin**
- Approve or reject services, manage user roles, see every booking and every payment
- Overview with revenue by month, bookings by status and users by role

**Account**
- Email and password sign-up and sign-in (Better Auth), a role chosen at sign-up, and a profile page with photo upload

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router), React 19, TypeScript
- Tailwind CSS 4, [shadcn/ui](https://ui.shadcn.com) components, Lucide icons, Sonner toasts
- [Recharts](https://recharts.org) (through the shadcn chart component) for dashboard charts
- [Better Auth](https://better-auth.com) with the MongoDB adapter and the JWT plugin
- [ImgBB](https://api.imgbb.com) for image uploads

## How it fits together

1. Better Auth runs inside this Next.js app and stores users and sessions in MongoDB.
2. For API calls the app gets a short-lived JWT from Better Auth and sends it to the Express server as a Bearer token. The server verifies it with this app's public keys.
3. Role checks happen twice: dashboard pages check the role on the server before rendering, and the Express API checks it again on every request.
4. Payments use Stripe's hosted Checkout page. This app never handles card details and needs no Stripe keys: the server creates the Checkout session and the customer is redirected to it.

## Project structure

```
src/
  app/
    (public)/        Home, Browse Services, Service details, How It Works
    (auth)/          Sign in and sign up
    dashboard/       customer, technician and admin dashboards, profile
    payment/         Stripe success and cancel pages
    api/             Better Auth route and the image upload route
  components/
    ui/              shadcn/ui building blocks
    layout/          navbar, footer, containers
    dashboard/       sidebar, stat cards and charts
    bookings/ services/ payments/ admin/ shared/   feature components
  lib/               API helpers, validation, formatting, auth setup
  types/             shared TypeScript types
```

## Deployment

Deploy to [Vercel](https://vercel.com), with `BETTER_AUTH_URL` set to the deployed URL and `NEXT_PUBLIC_API_URL` set to the deployed server. The server must list this app's URL in its `CLIENT_ORIGINS` and `AUTH_BASE_URL`.

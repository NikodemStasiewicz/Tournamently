# Tournamently_Beta
App to manage tournaments
## Getting Started

1. Prerequisites
   - Node.js 18+
   - MongoDB (Atlas or local)

2. Install dependencies
```
npm install
```
3. Script
```
npx ts-node seed.ts
```

4. Generate Prisma client
```
npx prisma generate
```

5. Configure environment variables (see below) in `.env`

6. Run the dev server
```
npm run dev
```

The app should be available at http://localhost:3000.

---

## Environment Variables

Create a `.env` file with at least:

```
DATABASE_URL="mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority"
JWT_SECRET="your-strong-secret"
```

- `DATABASE_URL`: MongoDB connection string
- `JWT_SECRET`: secret for signing/verifying JWTs

---

## Development Scripts

Common Next.js scripts (exact names may vary by your package.json):

- `npm run dev` – start the development server
- `npm run build` – create a production build
- `npm run start` – start the production server

Prisma:
- `npx prisma generate` – generate Prisma client

---











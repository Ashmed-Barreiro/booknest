# BookNest (Full-Stack) — Node.js + Vue 3

## Requirements
- Node.js 18+ (recommended 20+)

## Run (dev)
### 1) Backend
```bash
cd backend
cp .env.example .env
npm i
npx prisma migrate dev --name init
npm run dev
```

Backend: http://localhost:4000

### 2) Frontend
```bash
cd ../frontend
npm i
npm run dev
```

Frontend: http://localhost:5173

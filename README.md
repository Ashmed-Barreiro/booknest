# BookNest (Full-Stack) — Node.js + Vue 3

## Requisitos
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

### 2) Frontend
```bash
cd ../frontend
npm i
npm run dev
```



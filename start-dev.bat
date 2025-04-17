@echo off
set NODE_ENV=development
set DATABASE_URL=postgresql://user:password@localhost:5432/mock_db
npx tsx server/index.ts 
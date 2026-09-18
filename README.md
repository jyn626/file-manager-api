<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

> [!WARNING]
> Development in progress...

# File Processing API

> A simple NestJS backend API for uploading, processing, and organizing files with background jobs and PostgreSQL.

---

## Architecture Overview (not fully implemented yet)

```
Client ──> NestJS API (Auth / Routes) ──> PostgreSQL (Data & Users)
                 │
                 └──> BullMQ + Redis ──> Background Processing (SHA-256 / Metadata)

```

---

## Tech Stack

* **Framework:** NestJS (TypeScript)
* **Database & ORM:** PostgreSQL (temporarily SQLite) + Drizzle
* **Queue & Cache:** BullMQ + Redis
* **Auth:** Passport.js + JWT

---

## Quickstart
<i>Coming soon...</i>
<!--1. **Clone & install:**
```bash
git clone https://github.com/your-username/file-processing-api.git
cd file-processing-api
pnpm install

```


2. **Start DB & Redis:**
```bash
docker compose up -d postgres redis

```


3. **Run migrations & start server:**
```bash
pnpm Drizzle migrate dev
pnpm start:dev

```

-->

---

## API Routes
<i>Coming soon...</i>
<!--
| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Register user | No |
| `POST` | `/auth/login` | Login & get JWT | No |
| `POST` | `/files/upload` | Upload file | Yes |
| `GET` | `/files` | List/search files | Yes |
| `POST` | `/files/:id/process` | Trigger hashing & analysis | Yes |
| `GET` | `/jobs/:id` | Check processing status | Yes |
-->
---

## Roadmap

* [X] **Phase 1: Setup** — Project creation & basic `/health` route
* [X] **Phase 2: Controllers & Services** — In-memory files CRUD & DTO validation
* [X] **Phase 3: Metadata** — File size, MIME, and path extraction service
* [X] **Phase 4: Database** — PostgreSQL & Drizzle setup with real CRUD
* [X] **Phase 5: Uploads** — Multer disk storage integration & validation
* [X] **Phase 6: Hashing** — SHA-256 streaming & duplicate detection
* [X] **Phase 7: Categories** — Domain rules for file classification
* [ ] **Phase 8: Search & Filter** — Pagination, sorting, and search params
* [ ] **Phase 9: Auth** — JWT authentication & resource ownership
* [ ] **Phase 10: Pipes & Guards** — Global filters, custom decorators, ownership guards
* [ ] **Phase 11: Queue & Jobs** — BullMQ + Redis background processing
* [ ] **Phase 12: Optimization** — Stream performance & memory safety
* [ ] **Phase 13: Testing** — Unit & E2E tests with Jest
* [ ] **Phase 14: Error Handling** — Standardized error responses & retries
* [ ] **Phase 15: Architecture** — Clean module refactoring & Config validation
* [ ] **Phase 16: Docker** — Docker Compose for API, DB, and Redis
* [ ] **Phase 17: Completion** — Swagger docs & final system Polish

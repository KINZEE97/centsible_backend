# Centsible — Backend

REST API for a personal finance tracker. Users register, log in, organize their money into categories and record income and expenses, then get monthly summaries and per-category breakdowns.

Built with **Node.js, Express, TypeScript, PostgreSQL and Prisma**, and fully containerized with **Docker Compose**.

> The name is a pun on *cents* and *sensible*: every monetary value is stored as an integer number of cents.

---

## Features

- **Authentication** with JWT (register and login, passwords stored as hashes)
- **Per-user data isolation**: every query is scoped to the authenticated user
- **Categories** (income or expense type) with full CRUD
- **Transactions** with full CRUD, tied to a category of the same type
- **Monthly filter** and **pagination** on transaction listing
- **Monthly summary**: total income, total expenses and balance
- **Summary by category**: totals and percentages, split by income and expense (ready to feed two pie charts)
- **Cascade deletion**: deleting a category removes its transactions
- **Standardized error responses** with clear status codes
- **One-command setup** with Docker Compose (database, migrations and API)

---

## Tech stack

| Area | Technology |
|---|---|
| Runtime | Node.js 22 |
| Framework | Express 5 |
| Language | TypeScript |
| Database | PostgreSQL 17 |
| ORM | Prisma 7 (with the `pg` driver adapter) |
| Validation | Zod |
| Auth | JSON Web Tokens |
| Containers | Docker, Docker Compose (multi-stage build) |

---

## Getting started with Docker (recommended)

### Requirements

- [Docker](https://docs.docker.com/get-docker/) with Docker Compose

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/KINZEE97/centsible_backend.git
cd centsible_backend

# 2. Create your environment file
cp .env.example .env
# then edit .env and set your own password and JWT secret

# 3. Build and start everything
docker compose up --build -d
```

Docker Compose starts three services, in this order:

1. **db**: PostgreSQL, with a persistent volume and a healthcheck
2. **migrate**: applies the Prisma migrations once the database is healthy, then exits
3. **centsible-api**: starts only after the migrations finish successfully

Check that everything is running:

```bash
docker compose ps
```

You should see `db` as `healthy`, `migrate` as `Exited (0)` (this is expected) and the API as `running`. The API is available at **http://localhost:3333/api**.

### Useful commands

```bash
docker compose logs -f centsible-api   # follow the API logs
docker compose logs migrate            # see what the migrations did
docker compose down                    # stop everything, keep the data
docker compose down -v                 # stop everything and DELETE the database volume
```

### Troubleshooting

- **Port 5432 already in use**: you probably have a local PostgreSQL running. Change the left side of the database port mapping in `docker-compose.yaml` (for example `5433:5432`), or remove the port mapping, since the API reaches the database through the internal Docker network.
- **`authentication failed` after changing database credentials**: PostgreSQL only applies `POSTGRES_USER`, `POSTGRES_PASSWORD` and `POSTGRES_DB` when the volume is empty. Run `docker compose down -v` and start again.
- **API exits right after starting**: check `docker compose logs centsible-api`. A missing environment variable (such as `JWT_SECRET`) is the most common cause.

---

## Environment variables

Copy `.env.example` to `.env` and fill in the values.

| Variable | Description |
|---|---|
| `PORT` | Port the API listens on |
| `POSTGRES_USER` | PostgreSQL user (used by Docker Compose) |
| `POSTGRES_PASSWORD` | PostgreSQL password (used by Docker Compose) |
| `POSTGRES_DB` | PostgreSQL database name (used by Docker Compose) |
| `DATABASE_URL` | Connection string, used when running **without** Docker (host `localhost`). Docker Compose builds its own URL using the `db` service name |
| `JWT_SECRET` | Secret used to sign tokens. Generate one with `openssl rand -hex 32` |

Never commit your `.env` file. It is already listed in `.gitignore` and `.dockerignore`.

---

## Running without Docker

Requirements: Node.js 22 and a running PostgreSQL instance.

```bash
npm install

# make sure DATABASE_URL in .env points to your local database (host: localhost)
npx prisma generate --config prisma7.config.ts
npx prisma migrate dev --config prisma7.config.ts

npm run dev
```

Production build:

```bash
npm run build
npm run start
```

---

## API overview

Base URL: `http://localhost:3333/api`

### Conventions

| Topic | Rule |
|---|---|
| Authentication | Protected routes expect `Authorization: Bearer <token>` |
| Money | Always an **integer in cents** (`R$ 12,50` is `1250`) |
| Transaction date | `YYYY-MM-DD` |
| Month filter | `YYYY-MM` (for example `2026-11`) |
| Pagination | `page` and `limit` query parameters |
| IDs | UUIDs |
| Transaction type | `INCOME` or `EXPENSE` |

### Endpoints

<!-- TODO: confirm these paths against src/routes -->

| Method | Route | Description |
|---|---|---|
| POST | `/auth/register` | Create an account |
| POST | `/auth/login` | Log in and receive a token |
| GET | `/categories` | List the user's categories (paginated) |
| GET | `/categories/:id` | Get one category with its transactions |
| POST | `/categories` | Create a category |
| PATCH | `/categories/:id` | Update a category |
| DELETE | `/categories/:id` | Delete a category (and its transactions) |
| GET | `/transactions` | List transactions (`month`, `page`, `limit`) |
| GET | `/transactions/:id` | Get one transaction |
| POST | `/transactions` | Create a transaction |
| PATCH | `/transactions/:id` | Update a transaction (partial update) |
| DELETE | `/transactions/:id` | Delete a transaction |
| GET | `/summary?month=YYYY-MM` | Total income, total expenses and balance |
| GET | `/summary/categories?month=YYYY-MM` | Totals and percentages per category |

### Examples

**Create a transaction**

```http
POST /api/transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Groceries",
  "amount": 15000,
  "transactionType": "EXPENSE",
  "date": "2026-11-09",
  "categoryId": "26d30199-368e-48bd-a25c-d3a7ee9509cb"
}
```

**List transactions for a month**

```http
GET /api/transactions?month=2026-11&page=1&limit=10
```

```json
{
  "data": [ ],
  "page": 1,
  "limit": 10,
  "total": 42
}
```

**Summary by category**

```http
GET /api/summary/categories?month=2026-02
```

```json
{
  "monthSelected": "2026-02",
  "incomeTotal": 2000,
  "expenseTotal": 150,
  "categories": [
    {
      "categoryId": "1a8991f6-eb7b-49e1-a968-4f3f49ae82db",
      "categoryName": "payday",
      "type": "INCOME",
      "total": 2000,
      "percentage": 100
    },
    {
      "categoryId": "26d30199-368e-48bd-a25c-d3a7ee9509cb",
      "categoryName": "food",
      "type": "EXPENSE",
      "total": 150,
      "percentage": 100
    }
  ]
}
```

Each percentage is calculated over the total of its **own type**, so the income and expense lists each add up to 100% (one pie chart for each).

### Error responses

Errors follow a consistent format.

```json
{ "message": "Category not found" }
```

Validation errors list every invalid field:

```json
{
  "message": "Invalid Data",
  "errors": [
    { "field": "date", "message": "Invalid date format, expected YYYY-MM-DD" }
  ]
}
```

| Status | Meaning |
|---|---|
| 400 | Invalid data |
| 401 | Missing, invalid or expired token |
| 404 | Resource not found (also returned for resources that belong to another user) |
| 409 | Conflict, such as a duplicate category name |
| 500 | Unexpected error (details are logged, never sent to the client) |

---

## Data model

```
User ──< Category ──< Transaction >── User
```

| Model | Main fields |
|---|---|
| **User** | `id`, `name`, `email` (unique), `passwordHash`, `createdAt` |
| **Category** | `id`, `name`, `type` (`INCOME` or `EXPENSE`), `userId`. Name is unique **per user** |
| **Transaction** | `id`, `description`, `amount` (cents), `transactionType`, `date`, `categoryId`, `userId` |

A transaction's type must match the type of its category, and a transaction can only use a category owned by the same user.

---

## Design decisions

- **Money as integers (cents)**: avoids floating-point rounding errors in totals and balances.
- **Validation at the boundary**: body, route params and query strings are validated with Zod before reaching the business logic. Unknown fields are rejected.
- **Centralized error handling**: a custom `HttpError` class and a global error middleware keep responses consistent and hide internal details from clients.
- **Layered structure**: routes, controllers and services, so HTTP concerns stay separate from business rules.
- **Authorization on every query**: all reads, updates and deletes filter by the authenticated user's id. Resources owned by someone else respond with `404`, so their existence is not revealed.
- **Dates in UTC**: month filters use an inclusive start and an exclusive end, which avoids timezone and end-of-month bugs.
- **Aggregations in the database**: totals use `groupBy` instead of looping over records in application code.
- **Safe Docker image**: multi-stage build, production dependencies only, runs as a non-root user, and secrets are never baked into the image.
- **Migrations as a separate step**: the Prisma CLI stays out of the production image and runs in a dedicated one-shot service.

---

## Project structure

```
.
├── prisma/                 # schema and migrations
├── src/
│   ├── controllers/        # HTTP layer: validates input, calls services, responds
│   ├── service/            # business rules and database access
│   ├── routes/             # route definitions
│   ├── middleware/         # authentication and error handling
│   └── server.ts           # app entry point
├── prisma7.config.ts       # Prisma configuration
├── Dockerfile              # multi-stage build
├── docker-compose.yaml     # db + migrate + api
├── .dockerignore
└── .env.example
```

---

## Roadmap

- [X] Rate limiting on the login route
- [ ] Nginx reverse proxy in front of the API
- [ ] Automated tests
- [ ] React frontend with a dashboard and category charts
- [ ] Deployment

---

## Author

**Alizon** — [GitHub](https://github.com/KINZEE97)

# LinguaBot Backend

This project is a production-ready Node.js + Express backend for the LinguaBot AI SaaS application.

Features

- Express.js server with global error handling
- MongoDB via Mongoose
- JWT authentication and password hashing (bcrypt)
- Rate limiting using `express-rate-limit`
- Claude (Anthropic) API integration wrapper
- Lingo.dev translation wrapper
- Clean architecture: `routes`, `models`, `services`, `middleware`, `utils`, `config`

Getting started

1. Copy `.env.example` to `.env` and fill values.

2. Install dependencies:

```bash
cd backend
npm install
```

3. Run the server:

```bash
npm run start
```

Development

Use `npm run dev` (requires `nodemon` installed globally or added as devDependency).

Notes

- Update `CLAUDE_ENDPOINT` and `CLAUDE_API_KEY` to point to your Anthropic/Claude endpoint.
- Lingo API keys should be set if you want translation features.

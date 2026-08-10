---
name: backend-security-coder
description: Secure backend coding practices, environment variable isolation, and Supabase RLS security.
---
# Backend Security Coder

Guidelines for secure serverless and database interaction:
- Enforce Row Level Security (RLS) policies on all database tables.
- Keep database connection credentials isolated in environment variables (`.env.local`).
- Validate data structure payloads before executing database operations.

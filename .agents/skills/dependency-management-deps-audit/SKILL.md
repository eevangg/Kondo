---
name: dependency-management-deps-audit
description: Auditing dependency vulnerabilities, package integrity, and supply chain security.
---
# Dependency Management Deps Audit

Guidelines for package security:
- Run periodic `npm audit` checks to catch known vulnerabilities.
- Pin dependency versions in `package.json` to prevent malicious updates.
- Keep build tools (Vite, React, Supabase SDK) up to date.

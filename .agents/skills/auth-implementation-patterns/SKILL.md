---
name: auth-implementation-patterns
description: Authentication standards, session persistence, remember-me options, and secure user profile switching.
---
# Authentication Implementation Patterns

Guidelines for secure user login and session management:
- Require PIN/Password authentication before granting app access.
- Support "Remember Me / Stay Logged In" via persistent local storage vs session-only memory.
- Provide clean profile switching with PIN re-verification.
- Sanitize state on logout to prevent unauthorized access.

---
name: cc-skill-security-review
description: Comprehensive security review checklist for feature implementations.
---
# Security Review Checklist

Pre-deployment security checklist for HomeSync:
- [ ] Authentication gate enforced prior to dashboard access.
- [ ] Session persistence respects "Remember Me" preference.
- [ ] PIN verification required for sensitive settings.
- [ ] API keys protected in environment variables.

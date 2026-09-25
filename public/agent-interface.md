# CRM AI CORE — Agent Interface

## Public agent access

CRM AI CORE exposes public product information through its website, structured metadata, sitemap, robots policy and llms.txt.

## Public discovery endpoints

- /llms.txt
- /robots.txt
- /sitemap.xml
- /features
- /solutions
- /demo
- /pricing
- /documentation
- /faq
- /ai-policy
- /contact

## API policy

CRM AI CORE APIs that perform authenticated operations are private application interfaces.

Agents must not assume that private API routes are publicly callable.

Authenticated API operations require the appropriate authentication and authorization context.

## Agent interaction model

Agents can:

1. Discover CRM AI CORE through public resources.
2. Read product and capability information.
3. Navigate public documentation and commercial pages.
4. Identify available product capabilities.
5. Use explicitly documented public interfaces when they become available.

Agents must not:

1. Access private tenant data without authorization.
2. Execute authenticated CRM operations without authorization.
3. Infer access permissions from public information.
4. Treat internal API routes as public interfaces.

## Canonical resources

Product: /
Features: /features
Solutions: /solutions
Documentation: /documentation
Pricing: /pricing
AI Policy: /ai-policy
Sitemap: /sitemap.xml
Robots: /robots.txt
LLM information: /llms.txt

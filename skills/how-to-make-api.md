## Steps to create an API reference page

1. **Read the DB schema** — visit `Backend Express/DB_Schema/db_command.sql` to find the relevant table. Extract columns, types, constraints (FKs, unique, defaults) and include a schema table in the doc.

2. **Read the middleware** — check `auth.middleware.js` (and any other middleware on the route) to understand:
   - Auth methods (JWT cookie vs API key Bearer)
   - Authorization checks (account membership, role permissions)
   - Document these in an "Authentication & Authorization" section.

3. **Read the controller** — understand for each endpoint:
   - Path params and request body fields (required vs optional, validations, max lengths)
   - The exact response shape (which fields are returned, status code)
   - All error conditions and their status codes

4. **Write the mdx file** in `docs/api-reference/<section>/` with this structure per endpoint:
   - Method badge (colored `<div>` with `<span>`) + route path
   - Short description of what it does
   - **Path Parameters** using `<ParamField path="..." type="..." required>`
   - **Request Body** (if applicable) using `<ParamField body="..." type="..." required>`
   - **Response** with full JSON example (use realistic UUIDs and timestamps)
   - **Error Codes** table covering: `200`, `201`, `400`, `401`, `403`, `404`, `409`, `500` (whichever apply)
   - **Example** inside `<CodeGroup>` with tabs for:
     - `bash cURL`
     - `javascript Node.js` (using fetch)
     - `python Python` (using requests)
     - `php PHP` (using curl_init)
     - `go Go` (using net/http)

## Method badge colors

| Method | Background | Text color |
|--------|-----------|------------|
| GET | `#16a34a` | white |
| POST | `#eab308` | black |
| PATCH | `#8b5cf6` | white |
| DELETE | `#ef4444` | white |

## Primary error codes to document

`200` `201` `400` `401` `403` `404` `409` `500` — include only the ones that actually apply to each endpoint based on the controller logic.

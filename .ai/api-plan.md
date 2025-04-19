/\* REST API Plan

# REST API Plan

## 1. Resources

- **Users**: Corresponds to the `users` table. Managed by Supabase Auth. Contains user identity and authentication details.
- **Generations**: Corresponds to the `generations` table. Tracks AI generation sessions. Each generation is linked to a user and may produce multiple flashcard suggestions. Includes statistics such as generated count and accepted counts.
- **Flashcards**: Corresponds to the `flashcards` table. Stores both AI-generated (accepted or edited) and manually created flashcards. Fields include `front` (max 200 characters) and `back` (max 500 characters), with a `source` field that indicates origin (`ai_full`, `ai_edited`, or `manual`).
- **Generation Error Logs**: Corresponds to the `generation_error_logs` table. Stores error details encountered during AI generation processes and is linked to both the user and a specific generation.

## 2. Endpoints

### A. Flashcards Endpoints

These endpoints manage the CRUD operations for flashcards.

- **GET /api/flashcards**

  - **Description**: Retrieve a paginated list of flashcards belonging to the authenticated user.
  - **Query Parameters**: `page` (default: 1), `limit` (default 10), `sortBy` (e.g., created_at), `filter` (e.g., source)
  - **Response JSON**:
    ```json
    {
      "flashcards": [
        { "id": "uuid", "front": "Text...", "back": "Text...", "source": "manual", "created_at": "timestamp" }
      ],
      "pagination": { "page": 1, "limit": 10, "total": 100 }
    }
    ```
  - **Success Codes**: 200 OK
  - **Error Codes**: 401 (unauthorized)

- **GET /api/flashcards/{flashcardId}**

  - **Description**: Retrieve detailed information about a specific flashcard.
  - **Response JSON**:
    ```json
    {
      "id": "uuid",
      "front": "Text...",
      "back": "Text...",
      "source": "ai_full",
      "generation_id": "uuid (optional)",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
    ```
  - **Success Codes**: 200 OK
  - **Error Codes**: 401 (unauthorized), 404 (not found)

- **POST /api/flashcards**

  - **Description**: Create one or multiple flashcards. This endpoint supports both manual creation and accepting AI-generated suggestions, allowing batch operations.
  - **Request JSON**:
    ```json
    {
      "flashcards": [
        {
          "front": "Flashcard front text (max 200 chars)",
          "back": "Flashcard back text (max 500 chars)",
          "source": "manual" | "ai_full" | "ai_edited",
          "generation_id": "uuid (optional)"
        }
      ]
    }
    ```
  - **Response JSON**:
    ```json
    {
      "flashcards": [
        {
          "id": "uuid",
          "front": "...",
          "back": "...",
          "source": "manual",
          "created_at": "timestamp"
        }
      ],
      "total_created": 1
    }
    ```
  - **Validations**:
    - Each flashcard's `front` must be ≤200 characters
    - Each flashcard's `back` must be ≤500 characters
    - The `source` must be one of the allowed values
    - Maximum 50 flashcards per request
  - **Success Codes**: 201 Created
  - **Error Codes**: 400 (validation error), 401 (unauthorized)

- **PUT /api/flashcards/{flashcardId}**

  - **Description**: Update an existing flashcard. Used for editing AI-generated flashcards (transitioning from `ai_full` to `ai_edited` or to manual).
  - **Request JSON**:
    ```json
    {
      "front": "Updated front text",
      "back": "Updated back text",
      "source": "ai_edited" | "manual"
    }
    ```
  - **Response JSON**:
    ```json
    { "id": "uuid", "front": "...", "back": "...", "source": "ai_edited", "updated_at": "timestamp" }
    ```
  - **Validations**:
    - `front` must be a string with a maximum of 200 characters
    - `back` must be a string with a maximum of 500 characters
    - `source` must be either "ai_edited" or "manual" when editing an AI-generated flashcard
    - Cannot change source back to "ai_full" once edited
    - All fields are required for PUT request
  - **Success Codes**: 200 OK
  - **Error Codes**: 400 (validation error), 401 (unauthorized), 404 (not found)

- **DELETE /api/flashcards/{flashcardId}**
  - **Description**: Delete a flashcard.
  - **Success Codes**: 204 No Content
  - **Error Codes**: 401 (unauthorized), 404 (not found)

### C. Generations Endpoints

These endpoints manage the AI generation sessions.

- **POST /api/generations**

  - **Description**: Initiate an AI flashcard generation process by submitting source text.
  - **Request JSON**:
    ```json
    { "source_text": "Input text for AI generation (1000 to 10000 characters)" }
    ```
  - **Validations**: Ensure the length of `source_text` is between 1000 and 10000 characters.
  - **Response JSON**:
    ```json
    {
      "generation_id": "uuid",
      "flashcard_suggestions": [
        { "id": 1, "front": "Generated front text", "back": "Generated back text" },
        { "id": 2, "front": "Generated front text 2", "back": "Generated back text 2" }
      ],
      "generated_count": 2
    }
    ```
  - **Success Codes**: 201 Created
  - **Error Codes**: 400 (validation error), 401 (unauthorized), 500 (AI service error - recorded in generation_error_logs table)

- **GET /api/generations**

  - **Description**: Retrieve a list of all generation sessions for the authenticated user.
  - **Query Parameters**: Optional filters (e.g., by date range, model)
  - **Response JSON**:
    ```json
    {
      "generations": [
        {
          "generation_id": "uuid",
          "model": "model-name",
          "generated_count": 5,
          "accepted_unedited_count": 3,
          "accepted_edited_count": 2,
          "created_at": "timestamp",
          "updated_at": "timestamp"
        }
      ],
      "total": 10,
      "page": 1,
      "per_page": 20
    }
    ```
  - **Success Codes**: 200 OK
  - **Error Codes**: 401 (unauthorized)

- **GET /api/generations/{generationId}**
  - **Description**: Retrieve details and statistics about a specific generation session, including the suggestions.
  - **Response JSON**:
    ```json
    {
      "generation_id": "uuid",
      "userId": "uuid",
      "model": "model-name",
      "generated_count": 5,
      "accepted_unedited_count": 3,
      "accepted_edited_count": 2,
      "flashcard_suggestions": [{ "front": "...", "back": "..." }],
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
    ```
  - **Success Codes**: 200 OK
  - **Error Codes**: 401 (unauthorized), 404 (not found)

### D. Generation Error Logs Endpoints (Optional)

These endpoints allow users to retrieve error logs related to AI generation events for debugging or auditing.

- **GET /api/generation-error-logs**
  - **Description**: Retrieve a list of generation error logs for the authenticated user.
  - **Query Parameters**: Optional filters (e.g., by model, date range)
  - **Response JSON**:
    ```json
    {
      "errorLogs": [
        {
          "id": "uuid",
          "model": "model-name",
          "error_code": "ERR_CODE",
          "error_message": "Error details",
          "created_at": "timestamp"
        }
      ]
    }
    ```
  - **Success Codes**: 200 OK
  - **Error Codes**: 401 (unauthorized)

## 3. Authentication and Authorization

- The API will use JWT-based authentication integrated with Supabase Auth.
- All endpoints (except for `/api/auth/*`) require an `Authorization: Bearer <token>` header.
- Authorization is enforced on a per-resource basis. For example, a user can only access flashcards, generations, and error logs that belong to them (with PostgreSQL Row-Level Security policies).
- Additional security measures include rate limiting, CORS policies, and input sanitization.

## 4. Validation and Business Logic

### Input Validation

- **Flashcards**:
  - `front`: Must be a string with a maximum of 200 characters.
  - `back`: Must be a string with a maximum of 500 characters.
  - `source`: Must be one of `ai_full`, `ai_edited`, or `manual`.
- **Generations**:
  - `source_text`: Must be between 1000 and 10000 characters.
  - Other fields are validated according to their type (e.g., UUID for IDs).

### Business Logic

- **AI Generation Flow**:

  - A user submits source text via `POST /api/generations`.
  - The server validates the text length and calls an external AI service (via Openrouter.ai) to generate flashcard suggestions.
  - The suggestions are returned to the user without immediately saving them to the `flashcards` table.
  - The user can review suggestions and decide to accept (create a flashcard via `POST /api/flashcards`), edit (update via `PATCH /api/flashcards/{flashcardId}`), or reject them (no API call for rejection).

- **Flashcard Management**:

  - Manual creation of flashcards is handled by `POST /api/flashcards` with the source set to `manual`.
  - Editing a flashcard (for example, modifying an AI-generated flashcard) is performed via `PATCH /api/flashcards/{flashcardId}` and may change its source to `ai_edited` or `manual` based on the update.
  - Deletion of flashcards is straightforward, using `DELETE /api/flashcards/{flashcardId}`.

- **Error Handling**:
  - Validation errors return a 400 status code with details of the failed validations.
  - Unauthorized access returns 401.
  - Not found resources return 404.
  - Internal server or AI service errors return 500.

This plan is designed to be technology-agnostic with respect to the client (Astro, React, Tailwind, Shadcn/ui) while leveraging Supabase for backend user management and PostgreSQL for data persistence. The API endpoints explicitly implement the business logic outlined in the PRD and adhere to the database constraints and validations specified in the provided schema.
\*/

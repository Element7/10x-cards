# API Endpoint Implementation Plan: GET /api/flashcards

## 1. Przegląd punktu końcowego

Endpoint zwraca paginowaną listę fiszek należących do zalogowanego użytkownika. Wspiera sortowanie, filtrowanie i paginację wyników.

## 2. Szczegóły żądania

- Metoda HTTP: GET
- Struktura URL: /api/flashcards
- Parametry Query:
  - Opcjonalne:
    - page (number, default: 1): Numer strony
    - limit (number, default: 10): Liczba wyników na stronę
    - sortBy (string): Kolumna do sortowania (np. created_at)
    - filter (string): Filtrowanie po source (manual, ai_full, ai_edited)
- Headers:
  - Authorization: Bearer token (wymagany)

## 3. Wykorzystywane typy

```typescript
// DTOs
import { FlashcardDTO, FlashcardListResponseDTO, PaginationDTO } from "../types";

// Zod Schema dla walidacji query params
const QueryParamsSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(50).default(10),
  sortBy: z.enum(["created_at", "updated_at"]).optional(),
  filter: z.enum(["manual", "ai_full", "ai_edited"]).optional(),
});
```

## 4. Szczegóły odpowiedzi

- Status 200 OK:

```typescript
{
  flashcards: FlashcardDTO[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  }
}
```

- Status 400: Invalid query parameters
- Status 401: Unauthorized
- Status 500: Server error

## 5. Przepływ danych

1. Walidacja query params przez Zod
2. Pobranie user_id z kontekstu Supabase
3. Wywołanie FlashcardsService.getFlashcards()
4. Transformacja wyników do FlashcardListResponseDTO
5. Zwrócenie odpowiedzi

## 6. Względy bezpieczeństwa

1. Autentykacja:
   - Wykorzystanie Supabase Auth middleware
   - Weryfikacja JWT tokena
2. Autoryzacja:

   - RLS policies w Supabase:

   ```sql
   CREATE POLICY "Users can only view their own flashcards"
   ON public.flashcards
   FOR SELECT
   USING (auth.uid() = user_id);
   ```

3. Walidacja danych:

   - Sanityzacja parametrów query przez Zod
   - Parametryzowane zapytania SQL

4. Rate Limiting:
   - Implementacja limitu requestów per user/IP

## 7. Obsługa błędów

1. Błędy walidacji (400):

   ```typescript
   try {
     const params = QueryParamsSchema.parse(request.query);
   } catch (error) {
     if (error instanceof z.ZodError) {
       return new Response(
         JSON.stringify({
           error: "Invalid query parameters",
           details: error.errors,
         }),
         { status: 400 }
       );
     }
   }
   ```

2. Błędy autoryzacji (401):

   - Obsługa przez Supabase middleware

3. Błędy serwera (500):
   - Zwracanie bezpiecznej odpowiedzi użytkownikowi

## 8. Rozważania dotyczące wydajności

1. Indeksy bazy danych:

   ```sql
   CREATE INDEX idx_flashcards_user_id ON flashcards(user_id);
   CREATE INDEX idx_flashcards_created_at ON flashcards(created_at);
   ```

## 9. Etapy wdrożenia

1. Utworzenie pliku `src/pages/api/flashcards.ts`:

   ```typescript
   import { APIRoute } from "astro";
   import { createClient } from "@supabase/supabase-js";
   import { FlashcardsService } from "../../../services/flashcards.service";

   export const GET: APIRoute = async ({ request, locals }) => {
     const supabase = locals.supabase;
     const service = new FlashcardsService(supabase);
     // ... implementacja endpointu
   };
   ```

2. Implementacja FlashcardsService w `src/services/flashcards.service.ts`:

   ```typescript
   export class FlashcardsService {
     constructor(private supabase: SupabaseClient) {}

     async getFlashcards(params: QueryParams): Promise<FlashcardListResponseDTO> {
       // ... implementacja logiki
     }
   }
   ```

3. Dodanie walidacji query params przez Zod

4. Implementacja logiki pobierania danych z Supabase

5. Dodanie obsługi błędów i logowania

6. Implementacja RLS policies w Supabase i Auth dopiero po skończeniu developmentu. Narazie korzystamy z DEFAULTO_USER_ID w celu przyspieszenie developmentu

7. Dodanie testów jednostkowych i integracyjnych

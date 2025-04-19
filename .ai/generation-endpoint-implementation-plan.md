/\*
API Endpoint Implementation Plan: POST /api/generations

## 1. Przegląd punktu końcowego

Endpoint służy do inicjowania procesu generacji flashcards przez AI. Przyjmuje długi tekst wejściowy (source_text), waliduje jego długość, wywołuje zewnętrzny serwis AI do generowania sugestii flashcards oraz zapisuje dane sesji generacji w bazie danych. W odpowiedzi zwraca unikalny identyfikator generacji, listę sugestii flashcards oraz liczbę wygenerowanych propozycji.

## 2. Szczegóły żądania

- Metoda HTTP: POST
- Struktura URL: /api/generations
- Parametry:
  - Wymagane:
    - source_text (string) – tekst wejściowy o długości od 1000 do 10000 znaków
  - Opcjonalne: brak
- Request Body:
  ```json
  { "source_text": "..." }
  ```

## 3. Wykorzystywane typy

- DTO/Command Model:
  - GenerationCreateDTO: { source_text: string }
  - GenerationCreateResponseDTO: { generation_id: string, flashcard_suggestions: Array<{ id: number, front: string, back: string }>, generated_count: number }
  - FlashcardSuggestionDTO: { id: number, front: string, back: string, source: "ai_full" }

## 4. Szczegóły odpowiedzi

- Statusy:
  - 201 Created – udana generacja
  - 400 Bad Request – nieprawidłowe dane wejściowe (np. nieprawidłowa długość source_text)
  - 401 Unauthorized – brak autoryzacji
  - 500 Internal Server Error – błąd wewnętrzny, np. problem z zewnętrznym serwisem AI
- Struktura odpowiedzi (JSON):
  ```json
  {
    "generation_id": "uuid",
    "flashcard_suggestions": [{ "id": 1, "front": "...", "back": "..." }],
    "generated_count": 2
  }
  ```

## 5. Przepływ danych

1. Klient wysyła żądanie POST /api/generations z payloadem zawierającym source_text.
2. Warstwa API weryfikuje token autoryzacyjny i autentyczność użytkownika (Supabase Auth).
3. Walidacja wejścia: sprawdzenie obecności source_text i jego długości (1000-10000 znaków) za pomocą Zod.
4. Wywołanie logiki biznesowej w serwisie (np. generationService):
   - Utworzenie wpisu w tabeli generations.
   - Wywołanie zewnętrznego serwisu AI do generowania sugestii flashcards.
   - W przypadku sukcesu: otrzymanie flashcard_suggestions oraz generated_count.
5. Wypełnienie odpowiedzi API zgodnie z GenerationCreateResponseDTO.
6. W przypadku wystąpienia błędów przy wywołaniu AI, zapis błędów do tabeli generation_error_logs oraz zwrócenie statusu 500.

## 6. Względy bezpieczeństwa

- Uwierzytelnienie: Endpoint wymaga tokena JWT (Supabase Auth).
- Autoryzacja: Upewnienie się, że operacje wykonywane są na danych użytkownika (RLS w bazie danych).
- Walidacja wejścia: Dokładne sprawdzenie długości source_text, aby zapobiegać atakom (np. DoS, injection).
- Bezpieczne logowanie błędów – szczegóły nie są ujawniane klientowi.

## 7. Obsługa błędów

- 400 Bad Request: Błąd walidacji (np. source_text nie mieści się w dopuszczalnym zakresie).
- 401 Unauthorized: Brak lub nieprawidłowy token autoryzacyjny.
- 500 Internal Server Error: Problemy z komunikacją z zewnętrznym serwisem AI lub zapisem w bazie danych. W takich przypadkach szczegóły błędu są zapisywane w tabeli generation_error_logs.

## 8. Rozważania dotyczące wydajności

- Optymalizacja zapytań do bazy danych (indeksowanie pól takich jak user_id).
- Asynchroniczne przetwarzanie wywołań do serwisu AI, aby nie blokować głównego wątku.
- Wprowadzenie mechanizmu rate limiting dla tego endpointu.
- Monitorowanie opóźnień i przeciążenia podczas wywołań zewnętrznego serwisu AI.

## 9. Etapy wdrożenia

1. **Walidacja wejścia:**

   - Upewnić się, że walidacja przy użyciu Zod w endpoint'cie (oraz w module walidacyjnym) sprawdza, czy `source_text` jest dostarczony i mieści się w zakresie 1000–10000 znaków.

2. **Rozwój serwisu businessowego (`generationService`):**

   - Korzystając z już istniejącej struktury w `/src/lib/services/generationService.ts`, potwierdzić, że serwis na obecnym etapie używa mocków do symulacji wywołań zewnętrznego serwisu AI.
   - Zaimplementować logikę zapisu rekordu do tabeli `generations` oraz rejestrowania ewentualnych błędów do tabeli `generation_error_logs` – wszystko w środowisku deweloperskim na bazie mockowanych operacji.

3. **Testowanie serwisu:**

   - Napisać oraz uruchomić testy jednostkowe i integracyjne dla `generationService`, symulujące zarówno poprawny przepływ (prawidłowy `source_text` oraz zwrócone dane przez mocki), jak i scenariusze błędne (np. nieprawidłowa długość `source_text` lub symulowane błędy wywołania AI).

4. **Integracja mechanizmu autoryzacji (Supabase Auth):**

   - Dopiero po weryfikacji działania `generationService` z użyciem mocków, zaimplementować mechanizm weryfikacji tokena JWT w endpoint'cie, aby zapewnić, że operacje wykonuje autoryzowany użytkownik zgodnie z RLS w bazie.

5. **Integracja endpointu API:**

   - Utworzyć (lub zaktualizować) plik `/src/pages/api/generations` z ustawieniem `export const prerender = false`.
   - Zintegrować endpoint z `generationService` – wywoływać logikę biznesową (z walidacją Zod i obsługą wyników z mockami) oraz przekazywać odpowiedzi zgodnie z modelem `GenerationCreateResponseDTO`.
   - Obsłużyć przekazywanie komunikatów błędów, które zostaną zarejestrowane w `generation_error_logs`.

6. **Code review i wdrożenie na środowisko developerskie:**

   - Przeprowadzić przegląd kodu przez zespół, uruchomić pełne testy integracyjne z uwzględnieniem nowej logiki, walidacji i autoryzacji.
   - Wdrożyć rozwiązanie na środowisko developerskie oraz monitorować działanie endpointu.

7. **Finalizacja i optymalizacja:**
   - Po pozytywnym feedbacku ze środowiska developerskiego, stopniowo zastąpić mocki rzeczywistymi wywołaniami do serwisu AI.
   - Monitorować wydajność oraz logi błędów, wprowadzać optymalizacje i poprawki na podstawie wyników testów automatycznych i feedbacku od użytkowników.
     \*/

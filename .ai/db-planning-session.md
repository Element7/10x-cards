<conversation_summary>
<decisions>

1. Zdefiniowano cztery główne encje: users, flashcards, generations, generation_error_logs
2. Określono dokładną strukturę każdej encji z jej kolumnami i typami danych
3. Ustalono ograniczenia długości tekstu:
   - source_text_length: 1000-10000 znaków
   - flashcard front: max 200 znaków
   - flashcard back: max 500 znaków
4. Zdefiniowano typy generacji fiszek: ai_full, ai_edited, manual
5. Zdecydowano o użyciu hard-delete zamiast soft-delete
6. Zrezygnowano z implementacji kopii zapasowych i retencji danych w MVP
7. Zrezygnowano z implementacji tagów/kategorii w MVP
8. Zrezygnowano z wersjonowania fiszek w MVP
9. Zrezygnowano z zaawansowanego audytu operacji w MVP
10. Zrezygnowano z rozróżniania języków w strukturze bazy danych
    </decisions>

<matched_recommendations>

1. Implementacja RLS dla izolacji danych między użytkownikami
2. Użycie UUID jako kluczy głównych
3. Implementacja indeksów na kluczowych kolumnach (id, user_id, created_at)
4. Implementacja ograniczeń NOT NULL i CHECK dla walidacji długości tekstu
5. Użycie ENUM dla kolumny source w flashcards
6. Implementacja kluczy obcych z ON DELETE CASCADE
7. Użycie transakcji dla operacji atomowych
8. Implementacja prostego mechanizmu losowania fiszek
9. Użycie typów JSONB dla metadanych
10. Implementacja podstawowych ograniczeń UNIQUE
    </matched_recommendations>

<database_planning_summary>
Główne wymagania schematu bazy danych:

- Prosta, skalowalna struktura z czterema głównymi encjami
- Silna izolacja danych między użytkownikami
- Walidacja długości tekstu na poziomie bazy danych
- Śledzenie statystyk generowania i akceptacji fiszek

Kluczowe encje i relacje:

- users (1) -> (N) flashcards
- users (1) -> (N) generations
- users (1) -> (N) generation_error_logs
- generations (1) -> (N) flashcards

Bezpieczeństwo i skalowalność:

- RLS dla izolacji danych
- UUID jako klucze główne
- Indeksy na kluczowych kolumnach
- Proste, wydajne zapytania
- Brak zaawansowanych funkcji w MVP
  </database_planning_summary>

<unresolved_issues>

1. Brak nierozwiązanych kwestii - wszystkie główne decyzje zostały podjęte i wyjaśnione
2. Struktura bazy danych jest gotowa do implementacji w MVP
   </unresolved_issues>
   </conversation_summary>

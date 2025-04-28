# Plan testów dla aplikacji 10x Cards

## 1. Wprowadzenie

Plan testów dla aplikacji 10x Cards - narzędzia do generowania i zarządzania fiszkami edukacyjnymi z wykorzystaniem AI.

## 2. Zakres testów

### Testujemy:

- Tworzenie i edycję fiszek (manualnie i z AI)
- Logowanie i rejestrację użytkowników
- Interakcje z bazą danych Supabase
- Integrację z OpenRouter.ai

### Nie testujemy:

- Zewnętrznych usług (poza integracją)
- Infrastruktury hostingowej

## 3. Rodzaje testów

### 3.1 Testy jednostkowe

- React komponenty
- Funkcje pomocnicze
- Serwisy (obsługa OpenRouter.ai)

### 3.2 Testy integracyjne

- Endpoints API (flashcards, generations)
- Komunikacja z Supabase
- Interakcje komponentów React z Astro

### 3.3 Testy E2E

- Logowanie
- Tworzenie i edycja fiszek
- Generowanie fiszek przez AI

## 4. Kluczowe scenariusze testowe

### Logowanie i konta

- Logowanie istniejącego użytkownika

### Fiszki

- Ręczne dodawanie fiszek
- Usuwanie fiszek

### Generowanie AI

- Generowanie fiszek z krótkiego tekstu
- Edycja wygenerowanych sugestii
- Obsługa błędów API

## 5. Środowisko testowe

- Lokalne środowisko deweloperskie

## 6. Narzędzia

- Vitest
- React Testing Library (RTL) do testowania komponentów React
- Playwright dla testów E2E
- ESLint dla statycznej analizy kodu

## 7. Proces CI/CD

- Linting w pre-commit hooks
- Testy jednostkowe przy każdym buildzie
- Testy E2E przy każdym buildzie
- Testy smoke po deploymencie

## 8. Kryteria akceptacji

- Wszystkie testy jednostkowe przechodzą
- Kluczowe procesy biznesowe działają w testach E2E
- Brak krytycznych błędów bezpieczeństwa

## 9. Raportowanie błędów

- GitHub Issues z tagami: bug/feature/improvement
- Błędy opisane z krokami reprodukcji i oczekiwanym zachowaniem

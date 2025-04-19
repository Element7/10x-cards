# Implementacja Usługi OpenRouter API - Plan Wdrożenia

## 1. Opis usługi

Usługa OpenRouter API służy do integracji z interfejsem API OpenRouter, umożliwiającej uzupełnienie czatów opartych na LLM. Głównym celem usługi jest:

1. Zarządzanie komunikacją z API OpenRouter (wysyłanie zapytań i odbieranie odpowiedzi).
2. Formatowanie zapytań poprzez kombinację komunikatów systemowych oraz użytkownika.
3. Weryfikację i parsowanie odpowiedzi według zadanej struktury (response_format).
4. Zarządzanie konfiguracją, autoryzacją i bezpieczeństwem przekazywanych danych.

**Kluczowe komponenty usługi**:

1. **OpenRouterAPIClient**

   - Cel: Nawiązanie połączenia z API OpenRouter, wysyłanie zapytań i odbieranie odpowiedzi.
   - Funkcjonalność: Obsługa autoryzacji, zarządzanie nagłówkami, retry logic, konfiguracja timeoutów.
   - Potencjalne wyzwania:
     1. Niestabilność połączenia sieciowego.
     2. Przedawnienie tokenów autoryzacyjnych.
     3. Opóźnienia w odpowiedzi API.
   - Propozycje rozwiązań:
     1. Implementacja mechanizmu retry z backoff.
     2. Mechanizm automatycznego odnawiania tokenów.
     3. Obsługa timeoutów i fallbacków.

2. **RequestBuilder/Formatter**

   - Cel: Budowa poprawnie sformatowanych zapytań do API zgodnie z wymaganiami OpenRouter.
   - Funkcjonalność: Łączenie komunikatu systemowego, komunikatu użytkownika, określanie nazwy modelu i parametrów, w tym response_format.
   - Potencjalne wyzwania:
     1. Niezgodność formatowania wiadomości.
     2. Błędy w definicji schematu JSON (response_format).
   - Propozycje rozwiązań:
     1. Wykorzystanie walidacji schematu przed wysłaniem.
     2. Testy jednostkowe dla formatera.

3. **ResponseParser/Validator**

   - Cel: Weryfikacja i parsowanie odpowiedzi zwracanych przez OpenRouter API.
   - Funkcjonalność: Walidacja odpowiedzi względem ustalonego schematu JSON, ekstrakcja odpowiednich danych.
   - Potencjalne wyzwania:
     1. Otrzymanie odpowiedzi o nieoczekiwanym formacie.
     2. Błędy parsowania danych.
   - Propozycje rozwiązań:
     1. Implementacja walidacji JSON przy użyciu bibliotek do schematów.
     2. Logowanie niespójności i powiadamianie systemu o błędach.

4. **ErrorHandler**

   - Cel: Centralizacja obsługi błędów w całej usłudze.
   - Funkcjonalność: Przechwytywanie błędów, logowanie oraz zwracanie przyjaznych komunikatów o błędach.
   - Potencjalne wyzwania:
     1. Niedostateczne logowanie szczegółów błędów.
     2. Brak rozróżnienia typów błędów (sieci, walidacji, autoryzacji).
   - Propozycje rozwiązań:
     1. Użycie dedykowanego modułu logowania.
     2. Kategoryzacja błędów oraz implementacja mechanizmów retry dla powtarzalnych problemów.

5. **ConfigManager**
   - Cel: Zarządzanie konfiguracją i ustawieniami usługi (klucze API, adresy, parametry modelu).
   - Funkcjonalność: Bezpieczne przechowywanie i udostępnianie konfiguracji do innych komponentów.
   - Potencjalne wyzwania:
     1. Narażenie kluczy API w kodzie źródłowym.
     2. Problemy z synchronizacją konfiguracji między środowiskami.
   - Propozycje rozwiązań:
     1. Przechowywanie w zmiennych środowiskowych.
     2. Weryfikacja i automatyczne ładowanie konfiguracji przy uruchamianiu usługi.

## 2. Opis konstruktora

Konstruktor odpowiedzialny jest za inicjalizację głównych komponentów usługi, w tym:

- Ustawienie konfiguracji (API key, endpoint, domyślna nazwa modelu, domyślne parametry modelu).
- Inicjalizację klienta API oraz modułów formatowania i parsowania.
- Konfigurację mechanizmu retry oraz ustawienie loggera.

Przykładowe parametry konstruktora:

- apiKey: Klucz autoryzacyjny do OpenRouter API.
- endpoint: Adres URL interfejsu API OpenRouter.
- defaultModel: Domyślna nazwa modelu (np. "gpt-4").
- modelParams: Domyślne parametry modelu (np. { temperature: 0.7, max_tokens: 150 }).

## 3. Publiczne metody i pola

**Metody:**

1. sendRequest(requestPayload): Wysyła zapytanie do API, łącznie z komunikatami systemowymi i użytkownika oraz dodatkowymi parametrami.
2. parseResponse(rawResponse): Waliduje i parsuje odpowiedź, przekształcając ją do ustalonej struktury.
3. getStatus(): Zwraca aktualny status połączenia oraz konfiguracji usługi.

**Pola:**

- config: Obiekt zawierający konfigurację usługi (klucze, endpoint, parametry modelu).
- apiClient: Instancja klienta do obsługi komunikacji z OpenRouter API.
- logger: Narzędzie do logowania błędów i operacji.

## 4. Prywatne metody i pola

**Metody:**

1. formatRequest(data): Prywatna metoda do budowy zapytań z uwzględnieniem komunikatów systemowych i użytkownika.
2. setupHeaders(): Konfiguruje nagłówki HTTP, w tym tokeny autoryzacyjne.
3. retryRequest(): Logika ponawiania zapytań w przypadku niepowodzenia.

**Pola:**

- \_internalToken: Prywatne pole przechowujące aktualny token autoryzacyjny.
- \_retryCount: Licznik prób ponownego wysyłania zapytań.
- \_internalLogger: Prywatny logger do diagnostyki błędów.

## 5. Obsługa błędów

Potencjalne scenariusze błędów i sposoby ich obsługi:

1. Błąd sieciowy (timeout, brak połączenia):
   - Rozwiązanie: Mechanizm retry z backoff oraz odpowiednie logowanie błędu.
2. Błąd autoryzacji (przedawniony token, błędny klucz API):
   - Rozwiązanie: Automatyczne odnawianie tokenu oraz walidacja klucza przed wysyłką zapytania.
3. Błąd walidacji odpowiedzi (niezgodny response_format):
   - Rozwiązanie: Walidacja odpowiedzi przy użyciu JSON Schema, zwracanie przyjaznych komunikatów błędu.
4. Błąd parsowania danych (błędny format JSON):
   - Rozwiązanie: Obsługa wyjątków podczas parsowania oraz fallback do komunikatu standardowego.

## 6. Kwestie bezpieczeństwa

- Przechowywanie kluczy API i poufnych danych w zmiennych środowiskowych.
- Wymuszanie użycia HTTPS dla wszystkich połączeń z API.
- Weryfikacja i sanitizacja danych wejściowych (komunikaty użytkownika).
- Ograniczenie liczby prób wysłania zapytań w celu ochrony przed atakami typu denial-of-service.

## 7. Plan wdrożenia krok po kroku

1. **Konfiguracja środowiska**

   - Ustaw zmienne środowiskowe (API key, endpoint, domyślny model, parametry modelu).
   - Zaimplementuj moduł ConfigManager do bezpiecznego przechowywania konfiguracji.

2. **Implementacja OpenRouterAPIClient**

   - Utwórz klasę odpowiedzialną za komunikację z API (setupHeaders, sendRequest, mechanizm retry).
   - Zaimplementuj obsługę autoryzacji oraz odnawiania tokenu.

3. **Budowanie zapytań (RequestBuilder)**

   - Zintegruj komunikaty:
     1. Systemowy: np. { system: "You are a helpful assistant for educational flashcards." }
     2. Użytkownika: pobierany dynamicznie z interfejsu.
     3. Response_format: np.
        { type: 'json_schema', json_schema: { name: 'OpenRouterResponse', strict: true, schema: { answer: 'string', suggestions: 'array' } } }
     4. Nazwa modelu: np. "gpt-4"
     5. Parametry modelu: np. { temperature: 0.7, max_tokens: 150 }
   - Zapewnij walidację formatu JSON przed wysłaniem zapytania.

4. **Implementacja ResponseParser**

   - Zaimplementuj logikę walidacji odpowiedzi za pomocą ustalonego schematu.
   - Dodaj mechanizm obsługi wyjątków w przypadku niezgodności formatu.

5. **Obsługa błędów i logowanie**

   - Zintegruj moduł ErrorHandler, który będzie kategoryzował błędy (sieciowe, autoryzacyjne, walidacyjne) i podejmował odpowiednie działania (retry, fallback, logging).

6. **Testowanie integracji**

   - Opracuj zestaw testów jednostkowych oraz integracyjnych sprawdzających poprawność komunikacji z OpenRouter API.
   - Przeprowadź testy na środowisku developerskim.

7. **Wdrożenie oraz monitorowanie**
   - Wdróż usługę w środowisku staging, monitorując logi i błędy.
   - Po zatwierdzeniu, wdroż usługę na produkcję, wprowadzając mechanizmy monitorujące oraz alert dla krytycznych błędów.

---

Powyższy przewodnik implementacji stanowi kompletną dokumentację integracji usługi OpenRouter API w projekcie, zgodnie z wytycznymi stacku technicznego, zasadami implementacji oraz wymaganiami produktu. Dzięki temu developerzy będą mieli jasne wytyczne dotyczące kluczowych komponentów, sposobu walidacji danych oraz obsługi błędów i zabezpieczeń.

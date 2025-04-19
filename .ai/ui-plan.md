# Architektura UI dla 10x Cards

## 1. Przegląd struktury UI

Architektura interfejsu użytkownika dla 10x Cards została zaprojektowana, aby sprostać wymaganiom produktu, korzystając z Astro, React, Tailwind i komponentów shadcn/ui. Główne cele to zapewnienie bezpiecznego i intuicyjnego systemu dla użytkowników, którzy mogą się autoryzować, zarządzać panelem użytkownika, generować fiszki (zarówno przy użyciu AI, jak i manualnie) oraz edytować już istniejące fiszki poprzez modal. Projekt uwzględnia responsywność, dostępność oraz mechanizmy asynchroniczne (spinner, inline walidacja i komunikaty błędów) reagujące na odpowiedzi API.

## 2. Lista widoków

- **Widok Autoryzacji**

  - Ścieżka: `/login`
  - Główny cel: Umożliwienie logowania (mockowane na początkowym etapie) użytkownika.
  - Kluczowe informacje: Formularz logowania, pola dla danych uwierzytelniających, inline walidacja, komunikaty błędów.
  - Kluczowe komponenty: Formularz logowania, przycisk submit, komunikat błędu.
  - UX, dostępność i bezpieczeństwo: Dostępny formularz z etykietami ARIA, wyświetlanie komunikatów walidacji już przy wpisywaniu oraz ochrona przed nieautoryzowanym dostępem.

- **Dashboard**

  - Ścieżka: `/dashboard`
  - Główny cel: Centralny hub aplikacji, prezentujący podsumowanie konta oraz umożliwiający nawigację do dalszych funkcji (generacja i przegląd fiszek).
  - Kluczowe informacje: Podsumowanie profilu, szybki dostęp do widoku generacji i listy fiszek, opcja wylogowania.
  - Kluczowe komponenty: Panel użytkownika, pasek nawigacyjny oraz widżety informacyjne.
  - Uwagi UX, dostępność i bezpieczeństwo: Czytelna nawigacja, dobrze zorganizowane sekcje, bezpieczne mechanizmy wylogowania.

- **Widok Rejestracji**

  - Ścieżka: `/register`
  - Główny cel: Umożliwienie tworzenia nowego konta przez użytkownika.
  - Kluczowe informacje: Formularz rejestracji z polami wymaganymi do utworzenia konta (np. imię, nazwisko, email, hasło), walidacja danych oraz komunikaty błędów.
  - Kluczowe komponenty: Formularz rejestracji, przycisk submit, komunikaty walidacji.
  - Uwagi UX, dostępność i bezpieczeństwo: Jasne instrukcje, walidacja inline, zabezpieczenia przed spamem i XSS.

- **Widok Profilu**

  - Ścieżka: `/profile`
  - Główny cel: Prezentacja danych użytkownika, zarządzanie kontem oraz dostęp do opcji wylogowania.
  - Kluczowe informacje: Informacje o profilu, opcje edycji danych, przycisk wylogowania.
  - Kluczowe komponenty: Panel użytkownika, formularz edycji profilu, przycisk wylogowania.
  - Uwagi UX, dostępność i bezpieczeństwo: Czytelny interfejs prezentujący dane użytkownika, łatwy dostęp do ustawień konta i opcji bezpieczeństwa.

- **Widok Sesji Learningowej**

  - Ścieżka: `/learning-session`
  - Główny cel: Umożliwienie użytkownikowi rozpoczęcia interaktywnej sesji nauki na podstawie fiszek.
  - Kluczowe informacje: Widok prezentujący fiszki do nauki, opcje interaktywne (np. nauka, powtórka, test), wskaźnik postępu sesji.
  - Kluczowe komponenty: Interfejs prezentacji fiszek, przyciski akcji do przechodzenia między fiszkami, wskaźnik postępu oraz interaktywne elementy wspierające naukę.
  - Uwagi UX, dostępność i bezpieczeństwo: Intuicyjna nawigacja w trakcie sesji, czytelne przyciski oraz dostępny design na urządzenia mobilne.

- **Widok Generacji Fiszek**

  - Sekcje: 1. **Sekcja Generacji** - Formularz wprowadzania tekstu źródłowego (dla trybu AI) - Formularz manualnego tworzenia fiszek - Toggle switch do przełączania między trybami - Przycisk generacji/zapisu z indykatorem postępu

        2. **Sekcja Wyników Generacji AI**
           - Lista wygenerowanych fiszek w formie kart
           - Dla każdej fiszki:
             - Podgląd frontu i tyłu
             - Przyciski akcji:
               - Akceptuj (zapisuje fiszkę bez zmian)
               - Edytuj (otwiera modal edycji)
               - Odrzuć (usuwa z listy)

    = - Opcje masowe: - Zaakceptuj wszystkie - Odrzuć wszystkie

        3. **Modal Edycji Wygenerowanej Fiszki**
           - Formularz edycji z polami front (max 200 znaków) i back (max 500 znaków)
           - Inline walidacja
           - Przyciski:
             - Zapisz (zachowuje zmiany i oznacza jako 'ai_edited')
             - Anuluj (powrót bez zmian)
             - Odrzuć (usuwa fiszkę z listy)
           - Wskaźnik postępu podczas zapisywania

  - Cel główny: Zapewnienie intuicyjnego i efektywnego interfejsu do tworzenia fiszek, gdzie tryb AI umożliwia generację z natychmiastową weryfikacją i edycją wygenerowanych treści przed zapisem/usunieciem,
    a tryb manualny pozwala na bezpośrednie tworzenie i zapis fiszek do bazy danych. Interfejs powinien umożliwiać płynne przełączanie między trybami generacji oraz zapewniać jasną informację zwrotną o statusie operacji i ewentualnych błędach.
  - Ścieżka: `/flashcards/generate`
  - Główny cel: Umożliwienie tworzenia nowych fiszek poprzez generację przy użyciu AI lub ręcznie, w zależności od wybranego trybu.
  - Kluczowe informacje: Formularz z polami dla fiszek, przełącznik (toggle) pomiędzy trybem AI a trybem manualnym, przyciski uruchamiające proces generacji, wskaźniki asynchroniczne (spinner) oraz komunikaty błędów.
  - Kluczowe komponenty: Toggle switch, formularz wejściowy, przycisk akcji, spinner, komunikaty walidacji i błędów.
  - UX, dostępność i bezpieczeństwo: Natychmiastowa walidacja formularza, wyraźne informacje o stanie przetwarzania, responsywny design oraz zabezpieczenia przed błędami API.

- **Widok Listy Fiszek**

  - Ścieżka: `/flashcards`
  - Główny cel: Prezentacja wszystkich utworzonych fiszek użytkownika, z możliwością ich edycji.
  - Kluczowe informacje: Lista fiszek (widok skrócony z frontem i backiem), oznaczenie źródła (manual, ai_full, ai_edited), przycisk otwierający modal do edycji.
  - Kluczowe komponenty: Lista/fiszki (karty), przycisk edycji, modal do edycji, komunikaty walidacji.
  - UX, dostępność i bezpieczeństwo: Prosty i przejrzysty układ, możliwość edycji poprzez modal z inline walidacją, potwierdzenie akcji przed zapisaniem zmian, dbałość o dostępność (np. klawiatura, focus trap w modalu).

- **Modal Edycji Fiszki** (część widoku listy fiszek)
  - Cel: Umożliwienie modyfikacji wybranej fiszki bez opuszczania widoku listy.
  - Kluczowe informacje: Formularz edycji pola "front" i "back", aktualny stan fiszki, przyciski zapisu i anulowania.
  - Kluczowe komponenty: Formularz, przyciski akcji, komunikaty błędów walidacji.
  - UX, dostępność i bezpieczeństwo: Intuicyjny modal z czytelnym interfejsem, natychmiastowa walidacja, możliwość cofnięcia zmian, obsługa klawiatury i czytelne komunikaty błędów.

## 3. Mapa podróży użytkownika

1. Użytkownik wchodzi na stronę logowania (`/login`) i wprowadza swoje dane uwierzytelniające.
2. Po poprawnej autoryzacji użytkownik zostaje przekierowany do dashboardu (`/dashboard`), gdzie widzi podsumowanie swojego profilu oraz opcje dalszej nawigacji.
3. Użytkownik wybiera opcję generacji fiszek, przechodząc do widoku generacji (`/flashcards/generation`).
   - W widoku tym użytkownik wybiera między generowaniem fiszek przy pomocy AI lub ręcznie, wykorzystując toggle switch.
   - Po wprowadzeniu danych, użytkownik uruchamia proces generacji, widząc spinner podczas oczekiwania na odpowiedź z API.
   - W przypadku błędów, system wyświetla odpowiednie komunikaty i umożliwia poprawkę.
4. Po zakończeniu procesu generacji użytkownik może przeglądać utworzone fiszki w widoku listy (`/flashcards`).
5. W widoku listy fiszek użytkownik może kliknąć przycisk edycji, co otwiera modal do edycji wybranej fiszki.
   - W modal edycji użytkownik poprawia treść fiszki, a inline walidacja zapewnia, że dane są prawidłowe.
6. Po zakończonej edycji użytkownik zapisuje zmiany, a system aktualizuje fiszkę, obsługując ewentualne błędy API.

## 4. Układ i struktura nawigacji

- Główna nawigacja znajduje się w dashboardzie i jest dostępna jako pasek nawigacyjny (header lub sidebar), zawierający linki do:
  - Dashboard (`/dashboard`)
  - Generacja fiszek (`/flashcards/generate`)
  - Lista fiszek (`/flashcards`)
  - Panel użytkownika (opcje profilu i wylogowanie)
- Mechanizm nawigacji zapewnia spójne doświadczenie, umożliwiając szybki dostęp do kluczowych funkcji oraz informując użytkownika o aktualnym stanie (aktywny widok, komunikaty błędów, wskaźnik procesu).
- Poza główną nawigacją, każde działanie (np. zapis edycji w modalu) jest potwierdzane komunikatami oraz, w razie błędu, wyświetlany jest odpowiedni alert.

## 5. Kluczowe komponenty

- **Formularz Logowania:** Obsługuje uwierzytelnienie użytkownika z walidacją inline i komunikatami błędów.
- **Panel Użytkownika:** Wyświetla podstawowe informacje o profilu oraz opcję wylogowania.
- **Toggle Switch:** Umożliwia przełączanie między trybem generacji AI a trybem manualnym w widoku generacji fiszek.
- **Formularz Generacji Fiszek:** Pola do wprowadzania danych dla nowej fiszki (front i back) z ograniczeniami znaków i walidacją.
- **Spinner/Indicator:** Widoczny podczas asynchronicznych operacji API, informujący o postępie akcji.
- **Lista Fiszek:** Komponent prezentujący zbiór fiszek w czytelny sposób, z możliwością edycji.
- **Modal Edycji Fiszki:** Umożliwia edycję wybranej fiszki z natychmiastową walidacją danych i responsywnym układem.
- **Komponent Nawigacji:** Pasek lub sidebar z linkami do kluczowych widoków, zapewniający intuicyjne przemieszczanie się po aplikacji.
- **Komunikaty Błędów:** System wyświetlający informative komunikaty w przypadku błędów walidacji lub problemów z API.

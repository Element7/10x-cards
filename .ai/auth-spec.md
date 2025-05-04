/\* Specyfikacja modułu autentykacji i zarządzania kontem użytkownika

1. ARCHITEKTURA INTERFEJSU UŻYTKOWNIKA

---

a) Struktura stron i komponentów:

- Nowe strony:
  • /login – strona logowania
  • /register – strona rejestracji
  • /forgot-password – strona inicjująca proces odzyskiwania hasła
- Layouty:
  • PublicLayout – wykorzystywany przez strony dostępne dla niezalogowanych użytkowników (np. /login, /register, /forgot-password)
  • MainLayout – layout dla sekcji dostępnych dla zalogowanych użytkowników, zawiera m.in. header z przyciskiem wylogowania

b) Podział odpowiedzialności:

- Strony Astro:
  • Zapewniają strukturę HTML, routing oraz obsługę SSR (server-side rendering) z uwzględnieniem eksperymentalnych sesji w Astro (zgodnie z konfiguracją w astro.config.mjs).
  • Integrują się z backendowymi endpointami API do obsługi autentykacji.
- Komponenty client-side React (hydration):
  • Formularze interaktywne (AuthForm, LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm) zbudowane w TypeScript, wykorzystujące biblioteki UI Shadcn/ui oraz Tailwind CSS do stylizacji.
  • Komponenty odpowiedzialne za walidację wejścia (np. walidacja formatu email, siły hasła, zgodności pól) oraz wyświetlanie komunikatów błędów i alertów.

c) Walidacja i komunikaty błędów:

- Walidacja odbywa się zarówno po stronie klienta (React) jak i serwera (API endpointy), np.:
  • Sprawdzenie formatu adresu email
  • Minimalna długość hasła
  • Weryfikacja zgodności haseł (dla rejestracji)
- W przypadku błędów walidacji wyświetlane są komunikaty przy użyciu komponentów alertów z Shadcn/ui.
- Obsługa scenariuszy:
  • Rejestracja: Po poprawnym wypełnieniu formularza, dane są przesyłane do API, które komunikuje się z Supabase Auth. W przypadku sukcesu użytkownik jest przekierowywany do strony głównej, a w razie błędu pojawia się odpowiedni komunikat.
  • Logowanie: Po przesłaniu formularza następuje weryfikacja danych przez Supabase, a w razie problemu użytkownik otrzymuje informację o niepoprawnych danych logowania.
  • Odzyskiwanie hasła: Użytkownik wpisuje adres email, a system wysyła link resetujący. Po kliknięciu linku użytkownik trafia na stronę resetowania hasła, gdzie może ustawić nowe hasło.

2. LOGIKA BACKENDOWA

---

a) Struktura endpointów API:

- Umiejscowienie: src/pages/api/auth/
- Endpointy:
  • POST /api/auth/register – rejestracja nowego użytkownika
  • POST /api/auth/login – logowanie
  • POST /api/auth/logout – wylogowanie
  • POST /api/auth/forgot-password – inicjacja procesu odzyskiwania hasła (wysyłanie emaila z linkiem resetującym)
  • POST /api/auth/reset-password – reset hasła użytkownika poprzez weryfikację tokenu i ustawienie nowego hasła
  • DELETE /api/auth/account – usunięcie konta użytkownika wraz z przypisanymi fiszkami

b) Modele danych i walidacja:

- Dane użytkownika (model User) zarządzane są przez Supabase Auth, z kluczowymi polami:
  • email
  • hasło (przechowywane w sposób zaszyfrowany przez Supabase)
- Walidacja danych wejściowych przy użyciu mechanizmów typowania (TypeScript) lub bibliotek typu Zod, w celu zapewnienia poprawności przesyłanych danych.
- Mechanizm obsługi wyjątków z wykorzystaniem bloków try-catch oraz zwracania odpowiednich kodów statusu HTTP i komunikatów błędów.

c) Integracja z SSR:

- Endpointy będą wspierać dynamiczne renderowanie stron server-side, zgodnie z konfiguracją astro.config.mjs (adapter node w trybie standalone, wykorzystanie eksperymentalnych sesji).
- Uwierzytelnianie użytkownika odbywa się na poziomie serwera, gdzie sesja jest inicjalizowana po poprawnym logowaniu i zarządzana w trakcie działania aplikacji.

3. SYSTEM AUTENTYKACJI

---

a) Wykorzystanie Supabase Auth:

- Cały moduł autentykacji (rejestracja, logowanie, wylogowywanie oraz odzyskiwanie hasła) opiera się na usługach Supabase Auth, co zapewnia spójność i bezpieczeństwo operacji.
- Na backendzie, API korzysta z Supabase Client (najprawdopodobniej znajdującego się w src/db) do wykonywania operacji na użytkownikach.

b) Integracja z Astro:

- Wykorzystanie eksperymentalnych sesji dostępnych w Astro (zgodnie z konfiguracją w astro.config.mjs) do zarządzania stanem uwierzytelnienia użytkownika w aplikacji.
- Stworzenie warstwy serwisowej (np. w src/lib/auth.ts), która opakowuje metody Supabase Auth i udostępnia interfejs dla komponentów frontendu.
- Zapewnienie bezpiecznej komunikacji między stronami Astro a API (np. poprzez tokeny sesji, ciasteczka HTTP-only).

c) Bezpieczeństwo i dobre praktyki:

- Komunikacja z Supabase odbywa się przez HTTPS w środowiskach produkcyjnych.
- Wykorzystywanie najlepszych praktyk w zakresie przechowywania haseł i zarządzania tokenami, zgodnie z wytycznymi Supabase.
- Dbanie o odpowiedni mechanizm obsługi błędów i informowania użytkownika o problemach (np. błędne dane logowania, niewłaściwy token resetujący, wygasłe sesje).

## Podsumowanie:

Moduł autentykacji oparty na Supabase Auth integruje się zarówno z warstwą frontendu (Astro + React z Shadcn/ui i Tailwind CSS), jak i backendowymi API endpointami. System zapewnia spójną obsługę rejestracji, logowania oraz odzyskiwania hasła użytkowników, przy jednoczesnym uwzględnieniu walidacji danych, obsługi wyjątków i bezpieczeństwa aplikacji.
\*/

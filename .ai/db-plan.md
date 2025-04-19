## Schemat bazy danych PostgreSQL

### 1. Tabele i ich struktura

#### Tabela: users

this table is managed by supabase Auth

- id: UUID, PRIMARY KEY, generowany automatycznie (np. uuid_generate_v4())
- email: VARCHAR(255), NOT NULL, unikalny
- created_at: TIMESTAMPTZ, NOT NULL (ustawiany automatycznie, np. current timestamp)
- confirmed_at: TIMESTAMPTZ
- encrypted_password: VARCHAR NOT NULL

#### Tabela: generations

- id: UUID, PRIMARY KEY, generowany automatycznie
- user_id: UUID, NOT NULL, FOREIGN KEY odnoszący się do users(id) z opcją ON DELETE CASCADE
- model: VARCHAR NOT NULL
- generated_count: INTIGER NOT NULL
- accepted_unedited_count: INTIGER NULLABLE
- accepted_edited_count: INTIGER NULLABLE
- source_text_hash: VARCHAR NOT NULL
- source_text_length: INTIGER NOT NULL CHECK z ograniczeniem długości (między 1000 a 10000 znaków)
- generation_duration: INTIGER NOT NULL
- created_at: TIMESTAMPTZ, NOT NULL DEFAULT now()
- updated_at: TIMESTAMPTZ, NOT NULL DEFAULT now()

- created_at: TIMESTAMPTZ, NOT NULL (ustawiany automatycznie)

#### Tabela: flashcards

- id: UUID, PRIMARY KEY, generowany automatycznie
- user_id: UUID, NOT NULL, FOREIGN KEY odnoszący się do users(id) z opcją ON DELETE CASCADE
- generation_id: UUID, opcjonalny, FOREIGN KEY odnoszący się do generations(id) z opcją ON DELETE CASCADE
- front: VARCHAR(200), NOT NULL (maksymalnie 200 znaków)
- back: VARCHAR(500), NOT NULL (maksymalnie 500 znaków)
- created_at: TIMESTAMPTZ, NOT NULL (ustawiany automatycznie)
- updated_at: TIMESTAMPTZ, NOT NULL (ustawiany automatycznie)
- source: VARCHAR NOT NULL CHECK ('ai_full', 'ai_edited', 'manual')

#### Tabela: generation_error_logs

- id: UUID, PRIMARY KEY, generowany automatycznie
- user_id: UUID, NOT NULL, FOREIGN KEY odnoszący się do users(id) z opcją ON DELETE CASCADE
- model: VARCHAR NOT NULL
- source_text_hash: VARCHAR NOT NULL
- source_text_length: INTIGER NOT NULL CHECK z ograniczeniem długości (między 1000 a 10000 znaków)
- generation_id: UUID, NOT NULL, FOREIGN KEY odnoszący się do generations(id) z opcją ON DELETE CASCADE
- error_code: VARCHAR(100) NOT NULL
- error_message: TEXT, NOT NULL
- created_at: TIMESTAMPTZ, NOT NULL (ustawiany automatycznie)

### 2. Relacje między tabelami

- Jeden użytkownik z tabeli users może mieć wiele rekordów w tabelach generations, flashcards oraz generation_error_logs (relacja 1:N).
- Każdy rekord w tabeli generations (generacja) może być powiązany z wieloma rekordami w tabeli flashcards (relacja 1:N).

### 3. Indeksy

- Klucz główny (id) jest indeksowany domyślnie.
- Dodatkowe indeksy:
  - Indeks na kolumnie user_id w tabelach flashcards, generations oraz generation_error_logs, aby zoptymalizować zapytania łączące tabele.
  - Indeks na kolumnie generation_id w tabeli flashcards, usprawniający łączenie rekordów z tabelą generations.

### 4. Bezpieczeństwo – Row-Level Security (RLS)

- RLS zostanie wdrożony dla tabel flashcards, generations oraz generation_error_logs.
- Polityka RLS zapewni, że użytkownik ma dostęp wyłącznie do rekordów, w których kolumna user_id odpowiada bieżącemu użytkownikowi (np. poprzez current_setting('myapp.current_user_id')).

### 5. Uwagi dodatkowe

- Użycie UUID jako kluczy głównych gwarantuje unikalność i skalowalność systemu.
- Ograniczenia długości tekstu w kolumnach (source_text, front, back) zabezpieczają integralność danych zgodnie z wymaganiami biznesowymi.
- Opcja ON DELETE CASCADE w relacjach zapewnia automatyczne usunięcie powiązanych rekordów, co ułatwia utrzymanie spójności bazy danych.
- Schemat jest zgodny z najlepszymi praktykami projektowania baz danych i zoptymalizowany do technologii używanych w projekcie (PostgreSQL, Astro, TypeScript, React, Tailwind, Shadcn/ui).

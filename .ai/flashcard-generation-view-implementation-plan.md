# Plan implementacji widoku generacji fiszek

## 1. Przegląd

Widok generacji fiszek umożliwia użytkownikom tworzenie nowych fiszek na dwa sposoby: automatycznie przy pomocy AI oraz manualnie. W trybie AI użytkownik wprowadza tekst źródłowy, który jest przetwarzany przez sztuczną inteligencję w celu wygenerowania sugestii fiszek. Użytkownik może zaakceptować, edytować lub odrzucić każdą wygenerowaną fiszkę. W trybie manualnym użytkownik tworzy fiszki bezpośrednio, wprowadzając treść przodu i tyłu.

## 2. Routing widoku

Widok dostępny pod ścieżką: `/flashcards/generate`

## 3. Struktura komponentów

```
FlashcardGenerationView
├── ModeToggle
├── AIGenerationForm (gdy tryb AI aktywny)
│   ├── LoadingSpinner
│   └── ErrorMessage
├── ManualCreationForm (gdy tryb manual aktywny)
│   ├── LoadingSpinner
│   └── ErrorMessage
└── AIGeneratedFlashcardsList (gdy są wygenerowane fiszki)
    ├── FlashcardSuggestionItem[]
    │   └── EditFlashcardModal (gdy aktywny tryb edycji)
    │       ├── LoadingSpinner
    │       └── ErrorMessage
    └── BulkActions (przyciski akcji masowych)
```

## 4. Szczegóły komponentów

### FlashcardGenerationView

- Opis komponentu: Główny kontener widoku generacji fiszek, zarządza stanem całego widoku i renderuje odpowiednie komponenty dzieci w zależności od trybu.
- Główne elementy: Container, ModeToggle, AIGenerationForm/ManualCreationForm, AIGeneratedFlashcardsList (warunkowo)
- Obsługiwane interakcje: Przełączanie między trybami AI i manual
- Obsługiwana walidacja: Nie dotyczy (delegowane do dzieci)
- Typy: GenerationViewState
- Propsy: Nie dotyczy (komponent najwyższego poziomu)

### ModeToggle

- Opis komponentu: Przełącznik (toggle switch) między trybem generacji AI a trybem manualnym.
- Główne elementy: Toggle switch, etykiety trybów
- Obsługiwane interakcje: Kliknięcie w celu przełączenia trybu
- Obsługiwana walidacja: Nie dotyczy
- Typy: Nie dotyczy
- Propsy:
  - currentMode: "ai" | "manual"
  - onModeChange: (mode: "ai" | "manual") => void

### AIGenerationForm

- Opis komponentu: Formularz wprowadzania tekstu źródłowego dla generacji fiszek przez AI.
- Główne elementy: Pole tekstowe (textarea), przycisk generacji, LoadingSpinner, ErrorMessage
- Obsługiwane interakcje: Wprowadzanie tekstu, kliknięcie przycisku generacji
- Obsługiwana walidacja:
  - Tekst źródłowy musi mieć od 1000 do 10000 znaków
  - Walidacja inline z komunikatami błędów
- Typy: GenerationCreateRequestDto
- Propsy:
  - onGenerate: (sourceText: string) => Promise<void>
  - isLoading: boolean
  - error: string | null

### ManualCreationForm

- Opis komponentu: Formularz ręcznego tworzenia fiszek.
- Główne elementy: Pole front (input), pole back (textarea), przycisk zapisu, LoadingSpinner, ErrorMessage
- Obsługiwane interakcje: Wprowadzanie tekstu, kliknięcie przycisku zapisu
- Obsługiwana walidacja:
  - Front: maksymalnie 200 znaków
  - Back: maksymalnie 500 znaków
  - Walidacja inline z komunikatami błędów
- Typy: ManualFlashcardViewModel, FlashcardCreateRequestDto
- Propsy:
  - onSave: (flashcard: { front: string, back: string }) => Promise<void>
  - isLoading: boolean
  - error: string | null

### AIGeneratedFlashcardsList

- Opis komponentu: Lista wygenerowanych przez AI sugestii fiszek z opcjami masowych akcji.
- Główne elementy: Lista FlashcardSuggestionItem, przyciski akcji masowych (BulkActions)
- Obsługiwane interakcje: Kliknięcie przycisków akcji masowych
- Obsługiwana walidacja: Nie dotyczy
- Typy: FlashcardSuggestionViewModel[]
- Propsy:
  - flashcards: FlashcardSuggestionViewModel[]
  - onAcceptAll: () => void
  - onRejectAll: () => void
  - onAccept: (id: number) => void
  - onEdit: (id: number) => void
  - onReject: (id: number) => void

### FlashcardSuggestionItem

- Opis komponentu: Pojedyncza karta wygenerowanej sugestii fiszki z przyciskami akcji.
- Główne elementy: Karta z tekstem front i back, przyciski akcji (akceptuj, edytuj, odrzuć), LoadingSpinner
- Obsługiwane interakcje: Kliknięcie przycisków akcji
- Obsługiwana walidacja: Nie dotyczy
- Typy: FlashcardSuggestionViewModel
- Propsy:
  - flashcard: FlashcardSuggestionViewModel
  - onAccept: (id: number) => void
  - onEdit: (id: number) => void
  - onReject: (id: number) => void

### EditFlashcardModal

- Opis komponentu: Modal do edycji wygenerowanej fiszki.
- Główne elementy: Formularz z polami front i back, przyciski akcji (zapisz, anuluj, odrzuć), LoadingSpinner, ErrorMessage
- Obsługiwane interakcje: Edycja pól, kliknięcie przycisków akcji
- Obsługiwana walidacja:
  - Front: maksymalnie 200 znaków
  - Back: maksymalnie 500 znaków
  - Walidacja inline z komunikatami błędów
- Typy: FlashcardSuggestionViewModel
- Propsy:
  - flashcard: FlashcardSuggestionViewModel
  - onSave: (id: number, data: { front: string, back: string }) => Promise<void>
  - onCancel: () => void
  - onReject: (id: number) => void
  - isOpen: boolean
  - isLoading: boolean
  - error: string | null

### LoadingSpinner

- Opis komponentu: Wskaźnik ładowania dla operacji asynchronicznych.
- Główne elementy: Animowany spinner
- Obsługiwane interakcje: Nie dotyczy
- Obsługiwana walidacja: Nie dotyczy
- Typy: Nie dotyczy
- Propsy:
  - isLoading: boolean
  - size?: "small" | "medium" | "large"

### ErrorMessage

- Opis komponentu: Komunikat o błędzie.
- Główne elementy: Alert z komunikatem błędu
- Obsługiwane interakcje: Nie dotyczy
- Obsługiwana walidacja: Nie dotyczy
- Typy: Nie dotyczy
- Propsy:
  - message: string
  - onClose?: () => void

### BulkActions

- Opis komponentu: Przyciski akcji masowych dla wygenerowanych fiszek.
- Główne elementy: Przyciski "Zaakceptuj wszystkie" i "Odrzuć wszystkie"
- Obsługiwane interakcje: Kliknięcie przycisków
- Obsługiwana walidacja: Nie dotyczy
- Typy: Nie dotyczy
- Propsy:
  - onAcceptAll: () => void
  - onRejectAll: () => void

## 5. Typy

### GenerationViewState

```typescript
type GenerationMode = "ai" | "manual";

interface GenerationViewState {
  mode: GenerationMode;
  isGenerating: boolean;
  generationError: string | null;
  flashcardSuggestions: FlashcardSuggestionViewModel[];
  generationId: string | null;
  editingFlashcardId: number | null;
}
```

### FlashcardSuggestionViewModel

```typescript
interface FlashcardSuggestionViewModel {
  id: number;
  front: string;
  back: string;
  source: "ai_full";
  isProcessing: boolean;
  error: string | null;
}
```

### ManualFlashcardViewModel

```typescript
interface ManualFlashcardViewModel {
  front: string;
  back: string;
  frontError: string | null;
  backError: string | null;
  isProcessing: boolean;
  error: string | null;
}
```

### GenerationCreateRequestDto

```typescript
// Import z types.ts, zachowujemy snake_case zgodnie z API
interface GenerationCreateRequestDto {
  source_text: string;
}
```

### GenerationCreateResponseDto

```typescript
// Import z types.ts, zachowujemy snake_case zgodnie z API
interface GenerationCreateResponseDto {
  generation_id: string;
  flashcard_suggestions: FlashcardSuggestionDto[];
  generated_count: number;
}
```

### FlashcardSuggestionDto

```typescript
// Import z types.ts, zachowujemy snake_case zgodnie z API
interface FlashcardSuggestionDto {
  id: number;
  front: string;
  back: string;
  source: "ai_full";
}
```

### FlashcardCreateRequestDto

```typescript
// Import z types.ts, zachowujemy snake_case zgodnie z API
interface FlashcardCreateRequestDto {
  front: string; // max 200 znaków
  back: string; // max 500 znaków
  source: "manual" | "ai_full" | "ai_edited";
  generation_id?: string;
}
```

### FlashcardsCreateRequestDto

```typescript
// Dto dla żądania tworzenia wielu fiszek
interface FlashcardsCreateRequestDto {
  flashcards: FlashcardCreateRequestDto[];
}
```

### FlashcardCreateResponseDto

```typescript
// Import z types.ts, zachowujemy snake_case zgodnie z API
interface FlashcardCreateResponseDto {
  flashcards: FlashcardDto[];
  total_created: number;
}
```

### FlashcardDto

```typescript
// Import z types.ts, zachowujemy snake_case zgodnie z API
interface FlashcardDto {
  id: string;
  front: string;
  back: string;
  source: "manual" | "ai_full" | "ai_edited";
  generation_id: string | null;
  created_at: string;
  updated_at: string;
}
```

## 6. Zarządzanie stanem

Dla efektywnego zarządzania złożonym stanem widoku, należy utworzyć niestandardowy hook `useGenerationState`, który będzie odpowiedzialny za całą logikę biznesową widoku:

```typescript
function useGenerationState() {
  const [state, setState] = useState<GenerationViewState>({
    mode: "ai",
    isGenerating: false,
    generationError: null,
    flashcardSuggestions: [],
    generationId: null,
    editingFlashcardId: null,
  });

  // Funkcje zmieniające stan i komunikujące się z API
  const setMode = (mode: GenerationMode) => setState((prev) => ({ ...prev, mode }));

  const generateFlashcards = async (sourceText: string) => {
    // Implementacja generacji fiszek przez API
  };

  const createManualFlashcard = async (data: { front: string; back: string }) => {
    // Implementacja tworzenia fiszki manualnej przez API
  };

  const acceptFlashcard = async (id: number) => {
    // Implementacja akceptacji fiszki przez API
  };

  const editFlashcard = (id: number) => {
    // Ustawienie trybu edycji dla fiszki
  };

  const saveEditedFlashcard = async (id: number, data: { front: string; back: string }) => {
    // Implementacja zapisywania edytowanej fiszki przez API
  };

  const rejectFlashcard = (id: number) => {
    // Implementacja odrzucenia fiszki
  };

  const acceptAllFlashcards = async () => {
    // Implementacja akceptacji wszystkich fiszek przez API
  };

  const rejectAllFlashcards = () => {
    // Implementacja odrzucenia wszystkich fiszek
  };

  const clearError = () => setState((prev) => ({ ...prev, generationError: null }));

  return {
    state,
    setMode,
    generateFlashcards,
    createManualFlashcard,
    acceptFlashcard,
    editFlashcard,
    saveEditedFlashcard,
    rejectFlashcard,
    acceptAllFlashcards,
    rejectAllFlashcards,
    clearError,
  };
}
```

Dodatkowo, potrzebny będzie hook do walidacji danych:

```typescript
function useValidation() {
  const validateSourceText = (text: string) => {
    if (!text) return "Tekst źródłowy jest wymagany";
    if (text.length < 1000) return "Tekst musi mieć co najmniej 1000 znaków";
    if (text.length > 10000) return "Tekst nie może przekraczać 10000 znaków";
    return null;
  };

  const validateFlashcardFront = (text: string) => {
    if (!text) return "Przód fiszki jest wymagany";
    if (text.length > 200) return "Przód fiszki nie może przekraczać 200 znaków";
    return null;
  };

  const validateFlashcardBack = (text: string) => {
    if (!text) return "Tył fiszki jest wymagany";
    if (text.length > 500) return "Tył fiszki nie może przekraczać 500 znaków";
    return null;
  };

  return {
    validateSourceText,
    validateFlashcardFront,
    validateFlashcardBack,
  };
}
```

// Dodatkowo, potrzebujemy funkcji mapujących między typami API (snake_case) a modelami widoku (camelCase)

```typescript
// Funkcje mapujące modele API na modele widoku
function mapFlashcardSuggestionDtoToViewModel(dto: FlashcardSuggestionDto): FlashcardSuggestionViewModel {
  return {
    id: dto.id,
    front: dto.front,
    back: dto.back,
    source: dto.source,
    isProcessing: false,
    error: null,
  };
}

function mapToFlashcardCreateRequestDto(
  viewModel: { front: string; back: string },
  source: "manual" | "ai_full" | "ai_edited",
  generationId?: string
): FlashcardCreateRequestDto {
  return {
    front: viewModel.front,
    back: viewModel.back,
    source,
    generation_id: generationId,
  };
}
```

## 7. Integracja API

### Generacja fiszek przez AI

```typescript
const generateFlashcards = async (sourceText: string) => {
  setState((prev) => ({ ...prev, isGenerating: true, generationError: null }));

  try {
    const requestData: GenerationCreateRequestDto = {
      source_text: sourceText,
    };

    const response = await fetch("/api/generations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Błąd podczas generacji fiszek");
    }

    const data: GenerationCreateResponseDto = await response.json();

    // Mapowanie na model widoku
    const flashcardSuggestions = data.flashcard_suggestions.map(mapFlashcardSuggestionDtoToViewModel);

    setState((prev) => ({
      ...prev,
      flashcardSuggestions,
      generationId: data.generation_id,
      isGenerating: false,
    }));
  } catch (error) {
    setState((prev) => ({
      ...prev,
      generationError: error instanceof Error ? error.message : "Nieznany błąd",
      isGenerating: false,
    }));
  }
};
```

### Zapisywanie fiszek

```typescript
const saveFlashcard = async (
  flashcardData: { front: string; back: string },
  source: "manual" | "ai_full" | "ai_edited",
  generationId?: string
) => {
  const flashcardDto = mapToFlashcardCreateRequestDto(flashcardData, source, generationId);

  const requestData: FlashcardsCreateRequestDto = {
    flashcards: [flashcardDto],
  };

  const response = await fetch("/api/flashcards", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Błąd podczas zapisywania fiszki");
  }

  return (await response.json()) as FlashcardCreateResponseDto;
};
```

## 8. Interakcje użytkownika

### Przełączanie trybów

- Użytkownik klika toggle switch
- System zmienia tryb z AI na manual lub odwrotnie
- Renderowany jest odpowiedni formularz

### Generacja fiszek w trybie AI

- Użytkownik wprowadza tekst źródłowy w formularz
- System waliduje tekst (min 1000, max 10000 znaków)
- Użytkownik klika przycisk "Generuj"
- System wyświetla spinner ładowania
- Po ukończeniu generacji system wyświetla listę wygenerowanych fiszek

### Akceptacja fiszki

- Użytkownik klika przycisk "Akceptuj" przy fiszce
- System wyświetla spinner ładowania przy tej fiszce
- System wysyła żądanie do API w celu zapisania fiszki
- Po zapisaniu fiszka znika z listy lub jest oznaczona jako zapisana

### Edycja fiszki

- Użytkownik klika przycisk "Edytuj" przy fiszce
- System otwiera modal edycji z polami wypełnionymi danymi fiszki
- Użytkownik edytuje treść fiszki
- System waliduje wprowadzone dane (front max 200, back max 500 znaków)
- Użytkownik klika "Zapisz"
- System wyświetla spinner ładowania
- System wysyła żądanie do API w celu zapisania edytowanej fiszki
- Po zapisaniu modal jest zamykany, a fiszka znika z listy lub jest oznaczona jako zapisana

### Odrzucenie fiszki

- Użytkownik klika przycisk "Odrzuć" przy fiszce lub w modalu edycji
- System usuwa fiszkę z listy sugestii bez zapisywania jej w bazie danych

### Akcje masowe

- Użytkownik klika przycisk "Akceptuj wszystkie"
- System inicjuje proces zapisywania wszystkich fiszek
- System wyświetla spinner ładowania
- Po zakończeniu lista jest czyszczona lub fiszki są oznaczane jako zapisane

- Użytkownik klika przycisk "Odrzuć wszystkie"
- System usuwa wszystkie fiszki z listy sugestii bez zapisywania ich w bazie danych

### Ręczne tworzenie fiszki

- Użytkownik wypełnia formularz w trybie manual
- System waliduje wprowadzone dane (front max 200, back max 500 znaków)
- Użytkownik klika "Zapisz"
- System wyświetla spinner ładowania
- System wysyła żądanie do API w celu zapisania fiszki
- Po zapisaniu formularz jest czyszczony, a system wyświetla komunikat potwierdzenia

## 9. Warunki i walidacja

### Walidacja tekstu źródłowego (tryb AI)

- Tekst musi być wprowadzony (nie może być pusty)
- Tekst musi mieć co najmniej 1000 znaków
- Tekst nie może przekraczać 10000 znaków
- Walidacja jest przeprowadzana:
  - W trakcie wprowadzania tekstu (inline)
  - Przed wysłaniem formularza (blokuje wysłanie)

### Walidacja fiszki (tryb manual i edycja)

- Front:
  - Musi być wprowadzony (nie może być pusty)
  - Nie może przekraczać 200 znaków
- Back:
  - Musi być wprowadzony (nie może być pusty)
  - Nie może przekraczać 500 znaków
- Walidacja jest przeprowadzana:
  - W trakcie wprowadzania tekstu (inline)
  - Przed wysłaniem formularza (blokuje wysłanie)

## 10. Obsługa błędów

### Błędy walidacji

- Błędy walidacji są wyświetlane inline pod odpowiednimi polami
- Przyciski submit są nieaktywne, gdy dane nie przechodzą walidacji

### Błędy API

- Błędy generacji są wyświetlane w komponencie ErrorMessage
- Błędy zapisu fiszki są wyświetlane przy danej fiszce
- Każdy błąd zawiera przycisk lub opcję ponowienia akcji

### Brak połączenia

- System wykrywa brak połączenia i wyświetla odpowiedni komunikat
- Po przywróceniu połączenia użytkownik może ponowić akcję

### Timeout

- Dla długotrwałych operacji (np. generacja AI) system ustawia timeout
- Po przekroczeniu limitu czasu wyświetlany jest komunikat o problemie z odpowiedzią serwera

## 11. Kroki implementacji

1. Utworzenie struktury katalogów i plików

   ```
   src/
   └── components/
       └── flashcard-generation/
           ├── index.ts
           ├── FlashcardGenerationView.tsx
           ├── ModeToggle.tsx
           ├── AIGenerationForm.tsx
           ├── ManualCreationForm.tsx
           ├── AIGeneratedFlashcardsList.tsx
           ├── FlashcardSuggestionItem.tsx
           ├── EditFlashcardModal.tsx
           ├── BulkActions.tsx
           ├── LoadingSpinner.tsx
           └── ErrorMessage.tsx
   ```

2. Implementacja typów i modeli

   - Zdefiniowanie interfejsów i typów dla API (z suffiksem Dto, snake_case) w dedykowanym pliku
   - Zdefiniowanie modeli widoku (camelCase) w dedykowanym pliku
   - Implementacja funkcji mapujących między typami API a modelami widoku

3. Implementacja hooków do zarządzania stanem i walidacji

   - Utworzenie `useGenerationState` w dedykowanym pliku
   - Utworzenie `useValidation` w dedykowanym pliku

4. Implementacja komponentów bazowych

   - LoadingSpinner
   - ErrorMessage
   - ModeToggle

5. Implementacja formularzy

   - AIGenerationForm z walidacją
   - ManualCreationForm z walidacją

6. Implementacja komponentów do wyświetlania i zarządzania wygenerowanymi fiszkami

   - FlashcardSuggestionItem
   - EditFlashcardModal
   - BulkActions
   - AIGeneratedFlashcardsList

7. Implementacja głównego komponentu widoku

   - FlashcardGenerationView integrujący wszystkie komponenty

8. Utworzenie ścieżki w routingu Astro

   - Dodanie strony w `src/pages/flashcards/generate.astro`

9. Testy

   - Testy jednostkowe dla hooków i logiki biznesowej
   - Testy komponentów dla kluczowych interakcji
   - Testy end-to-end dla głównych ścieżek użytkownika

10. Optymalizacja wydajności
    - Dodanie memoizacji dla komponentów listy
    - Optymalizacja re-renderów przy aktualizacji stanu

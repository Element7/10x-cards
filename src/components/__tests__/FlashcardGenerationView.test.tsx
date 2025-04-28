import { render, screen } from "@testing-library/react";
import { FlashcardGenerationView } from "../FlashcardGenerationView";
import { vi, describe, it, expect, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import * as useGenerationStateModule from "../hooks/useGenerationState";
import type { GenerationMode, GenerationViewState } from "../types";
import type { FlashcardCreateDTO } from "@/types";

// Mock the hooks and components
vi.mock("../hooks/useGenerationState");

vi.mock("../ModeToggle", () => ({
  ModeToggle: ({ onModeChange }: { onModeChange: (mode: GenerationMode) => void }) => (
    <button onClick={() => onModeChange("manual")}>Toggle Mode</button>
  ),
}));

vi.mock("../AIGenerationForm", () => ({
  AIGenerationForm: ({ onGenerate }: { onGenerate: (text: string) => void }) => (
    <button onClick={() => onGenerate("test text")}>Generate</button>
  ),
}));

vi.mock("../ManualCreationForm", () => ({
  ManualCreationForm: ({ onSave }: { onSave: (data: FlashcardCreateDTO) => void }) => (
    <button onClick={() => onSave({ front: "test", back: "test", source: "manual" })}>Zapisz fiszkę</button>
  ),
}));

vi.mock("../AIGeneratedFlashcardsList", () => ({
  AIGeneratedFlashcardsList: ({
    onAccept,
    onReject,
    flashcards,
  }: {
    onAccept: (id: number) => void;
    onReject: (id: number) => void;
    flashcards: GenerationViewState["flashcardSuggestions"];
  }) => (
    <div>
      {flashcards.map((f) => (
        <div key={f.id}>
          <button onClick={() => onAccept(f.id)}>Accept {f.id}</button>
          <button onClick={() => onReject(f.id)}>Reject {f.id}</button>
        </div>
      ))}
    </div>
  ),
}));

describe("FlashcardGenerationView", () => {
  const mockGenerationState = {
    state: {
      mode: "ai" as GenerationMode,
      isGenerating: false,
      generationError: null,
      flashcardSuggestions: [],
      generationId: null,
      editingFlashcardId: null,
    },
    setMode: vi.fn(),
    generateFlashcards: vi.fn(),
    createFlashcard: vi.fn(),
    editFlashcard: vi.fn(),
    rejectFlashcard: vi.fn(),
    rejectAllFlashcards: vi.fn(),
    clearError: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(useGenerationStateModule, "useGenerationState").mockReturnValue(mockGenerationState);
  });

  it("should render the component", () => {
    render(<FlashcardGenerationView />);
    expect(screen.getByText(/Generowanie fiszek/i)).toBeInTheDocument();
  });

  it("should handle mode toggle", async () => {
    const mockState = {
      ...mockGenerationState,
      state: {
        ...mockGenerationState.state,
        mode: "manual" as const,
      },
    };
    vi.spyOn(useGenerationStateModule, "useGenerationState").mockReturnValue(mockState);

    render(<FlashcardGenerationView />);

    // After toggle, manual form should be visible
    expect(screen.getByText("Zapisz fiszkę")).toBeInTheDocument();
  });

  it("should handle flashcard generation", async () => {
    render(<FlashcardGenerationView />);
    const generateButton = screen.getByText("Generate");

    await userEvent.click(generateButton);

    expect(mockGenerationState.generateFlashcards).toHaveBeenCalledWith("test text");
  });

  it("should handle manual flashcard creation", async () => {
    const mockState = {
      ...mockGenerationState,
      state: {
        ...mockGenerationState.state,
        mode: "manual" as const,
      },
    };
    vi.spyOn(useGenerationStateModule, "useGenerationState").mockReturnValue(mockState);

    render(<FlashcardGenerationView />);

    const saveButton = screen.getByText("Zapisz fiszkę");
    await userEvent.click(saveButton);

    expect(mockGenerationState.createFlashcard).toHaveBeenCalledWith({
      front: "test",
      back: "test",
      source: "manual",
    });
  });

  it("should handle accepting flashcard", async () => {
    // Setup state with a flashcard
    const stateWithFlashcard = {
      ...mockGenerationState,
      state: {
        ...mockGenerationState.state,
        flashcardSuggestions: [
          {
            id: 1,
            front: "Test front",
            back: "Test back",
            source: "ai_full" as const,
            isProcessing: false,
            error: null,
          },
        ],
        generationId: "123",
      },
    };
    vi.spyOn(useGenerationStateModule, "useGenerationState").mockReturnValue(stateWithFlashcard);

    render(<FlashcardGenerationView />);
    const acceptButton = screen.getByText("Accept 1");

    await userEvent.click(acceptButton);

    expect(mockGenerationState.createFlashcard).toHaveBeenCalledWith({
      front: "Test front",
      back: "Test back",
      source: "ai_full",
      generation_id: "123",
    });
  });

  it("should handle rejecting flashcard", async () => {
    // Setup state with a flashcard
    const stateWithFlashcard = {
      ...mockGenerationState,
      state: {
        ...mockGenerationState.state,
        flashcardSuggestions: [
          {
            id: 1,
            front: "Test front",
            back: "Test back",
            source: "ai_full" as const,
            isProcessing: false,
            error: null,
          },
        ],
        generationId: "123",
      },
    };
    vi.spyOn(useGenerationStateModule, "useGenerationState").mockReturnValue(stateWithFlashcard);

    render(<FlashcardGenerationView />);
    const rejectButton = screen.getByText("Reject 1");

    await userEvent.click(rejectButton);

    expect(mockGenerationState.rejectFlashcard).toHaveBeenCalledWith(1);
  });
});

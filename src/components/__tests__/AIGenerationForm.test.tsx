import { render, screen, fireEvent } from "@testing-library/react";
import { AIGenerationForm } from "../AIGenerationForm";
import { vi, describe, it, expect, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";

describe("AIGenerationForm", () => {
  const mockOnGenerate = vi.fn();
  const mockOnErrorClear = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the form", () => {
    render(
      <AIGenerationForm onGenerate={mockOnGenerate} isGenerating={false} error={null} onErrorClear={mockOnErrorClear} />
    );

    expect(screen.getByLabelText(/Tekst źródłowy/i)).toBeInTheDocument();
    expect(screen.getByText(/Generuj fiszki/i)).toBeInTheDocument();
  });

  it("should show character count", async () => {
    render(
      <AIGenerationForm onGenerate={mockOnGenerate} isGenerating={false} error={null} onErrorClear={mockOnErrorClear} />
    );

    const textarea = screen.getByLabelText(/Tekst źródłowy/i);
    await userEvent.type(textarea, "test");

    expect(screen.getByText("4 / 10000")).toBeInTheDocument();
  });

  it("should validate minimum length", async () => {
    render(
      <AIGenerationForm onGenerate={mockOnGenerate} isGenerating={false} error={null} onErrorClear={mockOnErrorClear} />
    );

    const textarea = screen.getByLabelText(/Tekst źródłowy/i);
    const submitButton = screen.getByText(/Generuj fiszki/i);

    await userEvent.type(textarea, "test");
    await userEvent.click(submitButton);

    expect(screen.getByText(/Tekst musi mieć co najmniej 1000 znaków/i)).toBeInTheDocument();
    expect(mockOnGenerate).not.toHaveBeenCalled();
  });

  it("should validate maximum length", async () => {
    render(
      <AIGenerationForm onGenerate={mockOnGenerate} isGenerating={false} error={null} onErrorClear={mockOnErrorClear} />
    );

    const textarea = screen.getByLabelText(/Tekst źródłowy/i);
    const submitButton = screen.getByRole("button");

    // Use fireEvent.change instead of userEvent.type for large text
    fireEvent.change(textarea, { target: { value: "a".repeat(10001) } });
    await userEvent.click(submitButton);

    expect(screen.getByText(/Tekst nie może przekraczać 10000 znaków/i)).toBeInTheDocument();
    expect(mockOnGenerate).not.toHaveBeenCalled();
  });

  it("should submit valid text", async () => {
    render(
      <AIGenerationForm onGenerate={mockOnGenerate} isGenerating={false} error={null} onErrorClear={mockOnErrorClear} />
    );

    const textarea = screen.getByLabelText(/Tekst źródłowy/i);
    const submitButton = screen.getByRole("button");

    // Use fireEvent.change instead of userEvent.type for large text
    const validText = "a".repeat(1000);
    fireEvent.change(textarea, { target: { value: validText } });
    await userEvent.click(submitButton);

    expect(mockOnGenerate).toHaveBeenCalledWith(validText);
  });

  it("should disable form while generating", () => {
    render(
      <AIGenerationForm onGenerate={mockOnGenerate} isGenerating={true} error={null} onErrorClear={mockOnErrorClear} />
    );

    const textarea = screen.getByLabelText(/Tekst źródłowy/i);
    const submitButton = screen.getByRole("button");

    expect(textarea).toBeDisabled();
    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/Generowanie może potrwać kilka sekund/i)).toBeInTheDocument();
  });

  it("should display and clear error message", async () => {
    const error = "Test error message";

    render(
      <AIGenerationForm
        onGenerate={mockOnGenerate}
        isGenerating={false}
        error={error}
        onErrorClear={mockOnErrorClear}
      />
    );

    expect(screen.getByText(error)).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: /zamknij/i });
    await userEvent.click(closeButton);

    expect(mockOnErrorClear).toHaveBeenCalled();
  });
});

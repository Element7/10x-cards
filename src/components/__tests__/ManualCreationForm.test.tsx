import { render, screen } from "@testing-library/react";
import { ManualCreationForm } from "../ManualCreationForm";
import { vi, describe, it, expect, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import type { FlashcardCreateDTO } from "@/types";

describe("ManualCreationForm", () => {
  const mockOnSave = vi.fn();
  const mockOnErrorClear = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the form", () => {
    render(
      <ManualCreationForm onSave={mockOnSave} isProcessing={false} error={null} onErrorClear={mockOnErrorClear} />
    );

    expect(screen.getByLabelText(/Przód fiszki/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tył fiszki/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Zapisz fiszkę/i })).toBeInTheDocument();
  });

  it("should show character count for both fields", async () => {
    render(
      <ManualCreationForm onSave={mockOnSave} isProcessing={false} error={null} onErrorClear={mockOnErrorClear} />
    );

    const frontInput = screen.getByLabelText(/Przód fiszki/i);
    const backInput = screen.getByLabelText(/Tył fiszki/i);

    await userEvent.type(frontInput, "test front");
    await userEvent.type(backInput, "test back");

    expect(screen.getByText("10 / 200")).toBeInTheDocument(); // front count
    expect(screen.getByText("9 / 500")).toBeInTheDocument(); // back count
  });

  it("should validate empty fields", async () => {
    render(
      <ManualCreationForm onSave={mockOnSave} isProcessing={false} error={null} onErrorClear={mockOnErrorClear} />
    );

    const submitButton = screen.getByRole("button", { name: /Zapisz fiszkę/i });
    await userEvent.click(submitButton);

    expect(screen.getByText(/Przód fiszki jest wymagany/i)).toBeInTheDocument();
    expect(screen.getByText(/Tył fiszki jest wymagany/i)).toBeInTheDocument();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it("should validate maximum length for front", async () => {
    render(
      <ManualCreationForm onSave={mockOnSave} isProcessing={false} error={null} onErrorClear={mockOnErrorClear} />
    );

    const frontInput = screen.getByLabelText(/Przód fiszki/i);
    const submitButton = screen.getByRole("button", { name: /Zapisz fiszkę/i });

    await userEvent.type(frontInput, "a".repeat(201));
    await userEvent.click(submitButton);

    expect(screen.getByText(/Przód fiszki nie może przekraczać 200 znaków/i)).toBeInTheDocument();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it("should validate maximum length for back", async () => {
    render(
      <ManualCreationForm onSave={mockOnSave} isProcessing={false} error={null} onErrorClear={mockOnErrorClear} />
    );

    const backInput = screen.getByLabelText(/Tył fiszki/i);
    const submitButton = screen.getByRole("button", { name: /Zapisz fiszkę/i });

    await userEvent.type(backInput, "a".repeat(501));
    await userEvent.click(submitButton);

    expect(screen.getByText(/Tył fiszki nie może przekraczać 500 znaków/i)).toBeInTheDocument();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it("should submit valid form data", async () => {
    render(
      <ManualCreationForm onSave={mockOnSave} isProcessing={false} error={null} onErrorClear={mockOnErrorClear} />
    );

    const frontInput = screen.getByLabelText(/Przód fiszki/i);
    const backInput = screen.getByLabelText(/Tył fiszki/i);
    const submitButton = screen.getByRole("button", { name: /Zapisz fiszkę/i });

    await userEvent.type(frontInput, "Valid front");
    await userEvent.type(backInput, "Valid back");
    await userEvent.click(submitButton);

    const expectedData: FlashcardCreateDTO = {
      front: "Valid front",
      back: "Valid back",
      source: "manual",
    };

    expect(mockOnSave).toHaveBeenCalledWith(expectedData);
  });

  it("should disable form while processing", () => {
    render(<ManualCreationForm onSave={mockOnSave} isProcessing={true} error={null} onErrorClear={mockOnErrorClear} />);

    const frontInput = screen.getByLabelText(/Przód fiszki/i);
    const backInput = screen.getByLabelText(/Tył fiszki/i);
    const submitButton = screen.getByRole("button");

    expect(frontInput).toBeDisabled();
    expect(backInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/Zapisywanie fiszki/i)).toBeInTheDocument();
  });

  it("should show success message after saving", async () => {
    render(
      <ManualCreationForm onSave={mockOnSave} isProcessing={false} error={null} onErrorClear={mockOnErrorClear} />
    );

    const frontInput = screen.getByLabelText(/Przód fiszki/i);
    const backInput = screen.getByLabelText(/Tył fiszki/i);
    const submitButton = screen.getByRole("button", { name: /Zapisz fiszkę/i });

    await userEvent.type(frontInput, "Test front");
    await userEvent.type(backInput, "Test back");
    await userEvent.click(submitButton);

    // Success message should appear
    expect(screen.getByText(/Fiszka została zapisana/i)).toBeInTheDocument();

    // Form should be cleared
    expect(frontInput).toHaveValue("");
    expect(backInput).toHaveValue("");
  });

  it("should display and clear error message", async () => {
    const error = "Test error message";

    render(
      <ManualCreationForm onSave={mockOnSave} isProcessing={false} error={error} onErrorClear={mockOnErrorClear} />
    );

    expect(screen.getByText(error)).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: /zamknij/i });
    await userEvent.click(closeButton);

    expect(mockOnErrorClear).toHaveBeenCalled();
  });
});

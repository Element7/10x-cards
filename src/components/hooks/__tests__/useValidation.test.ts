import { renderHook } from "@testing-library/react";
import { useValidation } from "../useValidation";
import { describe, it, expect } from "vitest";

describe("useValidation", () => {
  describe("validateSourceText", () => {
    it("should return error for empty text", () => {
      const { result } = renderHook(() => useValidation());
      expect(result.current.validateSourceText("")).toBe("Tekst źródłowy jest wymagany");
    });

    it("should return error for text shorter than 1000 characters", () => {
      const { result } = renderHook(() => useValidation());
      const shortText = "a".repeat(999);
      expect(result.current.validateSourceText(shortText)).toBe("Tekst musi mieć co najmniej 1000 znaków");
    });

    it("should return error for text longer than 10000 characters", () => {
      const { result } = renderHook(() => useValidation());
      const longText = "a".repeat(10001);
      expect(result.current.validateSourceText(longText)).toBe("Tekst nie może przekraczać 10000 znaków");
    });

    it("should return null for valid text", () => {
      const { result } = renderHook(() => useValidation());
      const validText = "a".repeat(5000);
      expect(result.current.validateSourceText(validText)).toBeNull();
    });
  });

  describe("validateFlashcardFront", () => {
    it("should return error for empty front", () => {
      const { result } = renderHook(() => useValidation());
      expect(result.current.validateFlashcardFront("")).toBe("Przód fiszki jest wymagany");
    });

    it("should return error for front longer than 200 characters", () => {
      const { result } = renderHook(() => useValidation());
      const longFront = "a".repeat(201);
      expect(result.current.validateFlashcardFront(longFront)).toBe("Przód fiszki nie może przekraczać 200 znaków");
    });

    it("should return null for valid front", () => {
      const { result } = renderHook(() => useValidation());
      const validFront = "a".repeat(100);
      expect(result.current.validateFlashcardFront(validFront)).toBeNull();
    });
  });

  describe("validateFlashcardBack", () => {
    it("should return error for empty back", () => {
      const { result } = renderHook(() => useValidation());
      expect(result.current.validateFlashcardBack("")).toBe("Tył fiszki jest wymagany");
    });

    it("should return error for back longer than 500 characters", () => {
      const { result } = renderHook(() => useValidation());
      const longBack = "a".repeat(501);
      expect(result.current.validateFlashcardBack(longBack)).toBe("Tył fiszki nie może przekraczać 500 znaków");
    });

    it("should return null for valid back", () => {
      const { result } = renderHook(() => useValidation());
      const validBack = "a".repeat(300);
      expect(result.current.validateFlashcardBack(validBack)).toBeNull();
    });
  });
}); 
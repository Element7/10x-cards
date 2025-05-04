import { renderHook, act } from '@testing-library/react';
import { useGenerationState } from '../useGenerationState';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('useGenerationState', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe('setMode', () => {
    it('should switch mode and reset state', () => {
      const { result } = renderHook(() => useGenerationState());

      act(() => {
        result.current.setMode('manual');
      });

      expect(result.current.state).toEqual({
        mode: 'manual',
        isGenerating: false,
        generationError: null,
        flashcardSuggestions: [],
        generationId: null,
        editingFlashcardId: null,
      });
    });
  });

  describe('generateFlashcards', () => {
    it('should handle successful flashcard generation', async () => {
      const mockResponse = {
        generation_id: '123',
        flashcard_suggestions: [
          { id: 1, front: 'Test front', back: 'Test back', source: 'ai_full' },
        ],
        generated_count: 1,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const { result } = renderHook(() => useGenerationState());

      await act(async () => {
        await result.current.generateFlashcards('test source text');
      });

      expect(result.current.state.isGenerating).toBe(false);
      expect(result.current.state.generationId).toBe('123');
      expect(result.current.state.flashcardSuggestions).toHaveLength(1);
      expect(result.current.state.generationError).toBeNull();
    });

    it('should handle generation error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Generation failed' }),
      });

      const { result } = renderHook(() => useGenerationState());

      await act(async () => {
        await result.current.generateFlashcards('test source text');
      });

      expect(result.current.state.isGenerating).toBe(false);
      expect(result.current.state.generationError).toBe('Generation failed');
    });
  });

  describe('createFlashcard', () => {
    it('should handle successful AI flashcard creation', async () => {
      // First generate flashcards to set up the state
      const mockGenerationResponse = {
        generation_id: '123',
        flashcard_suggestions: [
          { id: 1, front: 'Test front', back: 'Test back', source: 'ai_full' },
        ],
        generated_count: 1,
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockGenerationResponse),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        });

      const { result } = renderHook(() => useGenerationState());

      // First generate the flashcards
      await act(async () => {
        await result.current.generateFlashcards('test source text');
      });

      // Then create the flashcard
      await act(async () => {
        await result.current.createFlashcard({
          front: 'Test front',
          back: 'Test back',
          source: 'ai_full',
          generation_id: '123',
        });
      });

      expect(result.current.state.flashcardSuggestions).toHaveLength(0);
    });

    it('should handle AI flashcard creation error', async () => {
      // First generate flashcards to set up the state
      const mockGenerationResponse = {
        generation_id: '123',
        flashcard_suggestions: [
          { id: 1, front: 'Test front', back: 'Test back', source: 'ai_full' },
        ],
        generated_count: 1,
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockGenerationResponse),
        })
        .mockResolvedValueOnce({
          ok: false,
          json: () => Promise.resolve({ error: 'Creation failed' }),
        });

      const { result } = renderHook(() => useGenerationState());

      // First generate the flashcards
      await act(async () => {
        await result.current.generateFlashcards('test source text');
      });

      // Then try to create the flashcard
      await act(async () => {
        await result.current.createFlashcard({
          front: 'Test front',
          back: 'Test back',
          source: 'ai_full',
          generation_id: '123',
        });
      });

      expect(result.current.state.flashcardSuggestions).toHaveLength(1);
      expect(result.current.state.flashcardSuggestions[0].error).toBe('Creation failed');
    });
  });

  describe('flashcard management', () => {
    it('should edit flashcard', async () => {
      // First generate flashcards to set up the state
      const mockGenerationResponse = {
        generation_id: '123',
        flashcard_suggestions: [
          { id: 1, front: 'Test front', back: 'Test back', source: 'ai_full' },
        ],
        generated_count: 1,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockGenerationResponse),
      });

      const { result } = renderHook(() => useGenerationState());

      // First generate the flashcards
      await act(async () => {
        await result.current.generateFlashcards('test source text');
      });

      act(() => {
        result.current.editFlashcard(1);
      });

      expect(result.current.state.editingFlashcardId).toBe(1);
    });

    it('should reject flashcard', async () => {
      // First generate flashcards to set up the state
      const mockGenerationResponse = {
        generation_id: '123',
        flashcard_suggestions: [
          { id: 1, front: 'Test front', back: 'Test back', source: 'ai_full' },
        ],
        generated_count: 1,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockGenerationResponse),
      });

      const { result } = renderHook(() => useGenerationState());

      // First generate the flashcards
      await act(async () => {
        await result.current.generateFlashcards('test source text');
      });

      act(() => {
        result.current.rejectFlashcard(1);
      });

      expect(result.current.state.flashcardSuggestions).toHaveLength(0);
    });

    it('should reject all flashcards', async () => {
      // First generate flashcards to set up the state
      const mockGenerationResponse = {
        generation_id: '123',
        flashcard_suggestions: [
          { id: 1, front: 'Test 1', back: 'Back 1', source: 'ai_full' },
          { id: 2, front: 'Test 2', back: 'Back 2', source: 'ai_full' },
        ],
        generated_count: 2,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockGenerationResponse),
      });

      const { result } = renderHook(() => useGenerationState());

      // First generate the flashcards
      await act(async () => {
        await result.current.generateFlashcards('test source text');
      });

      act(() => {
        result.current.rejectAllFlashcards();
      });

      expect(result.current.state.flashcardSuggestions).toHaveLength(0);
      expect(result.current.state.generationId).toBeNull();
    });
  });
}); 
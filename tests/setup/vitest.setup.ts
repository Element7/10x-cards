import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import matchers from "@testing-library/jest-dom/matchers";

// Extend Vitest's expect with Testing Library matchers
expect.extend(matchers);

// Add type support for jest-dom matchers
declare global {
  interface JestAssertion<T = unknown> {
    toBeInTheDocument(): T;
    toBeDisabled(): T;
    toBeEnabled(): T;
    toBeEmpty(): T;
    toBeEmptyDOMElement(): T;
    toBeInvalid(): T;
    toBeRequired(): T;
    toBeValid(): T;
    toBeVisible(): T;
    toContainElement(element: HTMLElement | null): T;
    toContainHTML(html: string): T;
    toHaveAccessibleDescription(description?: string | RegExp): T;
    toHaveAccessibleName(name?: string | RegExp): T;
    toHaveAttribute(attr: string, value?: string | number | boolean): T;
    toHaveClass(...classNames: string[]): T;
    toHaveFocus(): T;
    toHaveFormValues(values: Record<string, string | number | boolean>): T;
    toHaveStyle(css: Record<string, string | number>): T;
    toHaveTextContent(text: string | RegExp, options?: { normalizeWhitespace: boolean }): T;
    toHaveValue(value?: string | string[] | number): T;
    toBeChecked(): T;
    toBePartiallyChecked(): T;
    toHaveDisplayValue(value: string | RegExp | (string | RegExp)[]): T;
    toHaveErrorMessage(text: string | RegExp): T;
  }
}

// Automatically clean up after each test
afterEach(() => {
  cleanup();
});

// Setup global mocks if needed
// For example, if you need to mock the Supabase client:
/*
vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
          order: vi.fn(() => ({
            limit: vi.fn(),
          })),
        })),
      })),
      insert: vi.fn().mockReturnValue({ select: vi.fn() }),
      update: vi.fn().mockReturnValue({ eq: vi.fn() }),
      delete: vi.fn().mockReturnValue({ eq: vi.fn() }),
    })),
  })),
}));
*/

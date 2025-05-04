"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ValidationError {
  path: string[];
  message: string;
}

interface LoginResponse {
  error?: string;
  details?: ValidationError[];
  status?: number;
  name?: string;
  message?: string;
}

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setIsLoading(true);

    try {
      console.log("Attempting to log in with email:", email);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await response.json();
      console.log("Login response status:", response.status);

      if (!response.ok) {
        console.error("Login failed:", {
          status: response.status,
          statusText: response.statusText,
          data,
        });

        if (data.details) {
          setErrors(data.details);
        } else if (data.error) {
          let errorMessage = data.error;
          if (data.name === "AuthApiError" && data.status === 400) {
            errorMessage = "Nieprawidłowy email lub hasło";
          }
          setErrors([{ path: ["form"], message: errorMessage }]);
        } else {
          setErrors([{ path: ["form"], message: "Wystąpił nieznany błąd podczas logowania" }]);
        }
        return;
      }

      console.log("Login successful, redirecting...");
      window.location.href = "/flashcards/generate";
    } catch (err) {
      console.error("Login request failed:", err);
      setErrors([
        {
          path: ["form"],
          message: "Wystąpił błąd podczas komunikacji z serwerem. Spróbuj ponownie później.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldError = (fieldName: string) => {
    return errors.find((error) => error.path.includes(fieldName))?.message;
  };

  const getFormError = () => {
    return errors.find((error) => error.path.includes("form"))?.message;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nazwa@example.com"
            className="transition-colors focus-visible:ring-primary"
            required
            disabled={isLoading}
          />
          {getFieldError("email") && <div className="text-sm text-destructive">{getFieldError("email")}</div>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Hasło</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Wprowadź hasło"
            className="transition-colors focus-visible:ring-primary"
            required
            disabled={isLoading}
          />
          {getFieldError("password") && <div className="text-sm text-destructive">{getFieldError("password")}</div>}
        </div>
        {getFormError() && <div className="text-sm text-destructive font-medium">{getFormError()}</div>}
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
        {isLoading ? "Logowanie..." : "Zaloguj się"}
      </Button>
    </form>
  );
};

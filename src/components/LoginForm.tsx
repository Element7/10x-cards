"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ValidationError {
  path: string[];
  message: string;
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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details) {
          setErrors(data.details);
        } else {
          setErrors([{ path: ["form"], message: data.error || "Wystąpił błąd podczas logowania" }]);
        }
        return;
      }

      window.location.href = "/flashcards/generate";
    } catch (err) {
      setErrors([{ path: ["form"], message: "Wystąpił błąd podczas logowania" }]);
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
        {getFormError() && <div className="text-sm text-destructive">{getFormError()}</div>}
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
        {isLoading ? "Logowanie..." : "Zaloguj się"}
      </Button>
    </form>
  );
};

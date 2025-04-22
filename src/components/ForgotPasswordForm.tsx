"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Odzyskiwanie hasła (wysłanie linku resetującego):", { email });
    // Backend integration will be implemented later
  };

  return (
    <div className="rounded-xl border bg-card p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="text-xl font-semibold">Odzyskiwanie hasła</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Wprowadź swój adres email, aby otrzymać link resetujący hasło.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <Button type="submit" className="mt-4">
          Wyślij link resetujący
        </Button>
      </form>
    </div>
  );
};

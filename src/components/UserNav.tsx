import { LogOut } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";

interface UserNavProps {
  email?: string;
}

export function UserNav({ email }: UserNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const initials = email
    ? email
        .split("@")[0]
        .split(".")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
    : "?";

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      window.location.reload();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="relative">
      <Button variant="ghost" className="relative h-8 w-8 rounded-full" onClick={() => setIsOpen(!isOpen)}>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md border bg-white py-1 shadow-lg">
          <div className="px-4 py-2">{email && <p className="text-sm font-medium text-gray-900">{email}</p>}</div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Wyloguj się</span>
          </button>
        </div>
      )}
    </div>
  );
}

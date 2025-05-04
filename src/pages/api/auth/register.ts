import type { APIRoute } from "astro";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Nieprawidłowy format adresu email"),
  password: z.string().min(8, "Hasło musi mieć co najmniej 8 znaków"),
});

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    console.log("Received registration request for email:", body.email);

    const result = registerSchema.safeParse(body);

    if (!result.success) {
      console.error("Validation errors:", result.error.errors);
      return new Response(
        JSON.stringify({
          error: "Nieprawidłowe dane wejściowe",
          details: result.error.errors,
        }),
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    if (!locals.supabase) {
      console.error("Supabase client not found in locals");
      return new Response(
        JSON.stringify({ error: "Usługa autentykacji jest niedostępna" }),
        { status: 500 }
      );
    }

    const { data, error } = await locals.supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${new URL(request.url).origin}/login`,
      },
    });

    if (error) {
      console.error("Supabase auth error:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: error.status || 400 }
      );
    }

    console.log("Registration successful for user:", data.user?.id);
    return new Response(
      JSON.stringify({ message: "Rejestracja przebiegła pomyślnie" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Registration endpoint error:", error);

    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          error: "Nieprawidłowe dane wejściowe",
          details: error.errors,
        }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ error: "Wystąpił błąd wewnętrzny serwera" }),
      { status: 500 }
    );
  }
}; 
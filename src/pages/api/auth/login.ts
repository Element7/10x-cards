import type { APIRoute } from "astro";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    console.log("Received login request for email:", body.email);

    const result = loginSchema.safeParse(body);

    if (!result.success) {
      console.error("Validation errors:", result.error.errors);
      return new Response(
        JSON.stringify({
          error: "Invalid input data",
          details: result.error.errors,
        }),
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    if (!locals.supabase) {
      console.error("Supabase client not found in locals");
      return new Response(JSON.stringify({ error: "Authentication service unavailable" }), { status: 500 });
    }

    const { data, error } = await locals.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Supabase auth error:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: error.status || 400 });
    }

    console.log("Login successful for user:", data.user?.id);
    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (error) {
    console.error("Login endpoint error:", error);

    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          error: "Invalid input data",
          details: error.errors,
        }),
        { status: 400 }
      );
    }

    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
};

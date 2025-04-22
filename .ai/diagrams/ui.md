flowchart TD
%% Frontend - Publiczne strony z formularzami autentykacji
subgraph "Frontend - Strony Publiczne"
A[Przeglądarka]
B[PublicLayout]
C[LoginForm]
D[RegisterForm]
E[ForgotPasswordForm]
F[ResetPasswordForm]
end

    %% Backend API - Endpointy autentykacji
    subgraph "Backend API"
        G[POST /api/auth/login]
        H[POST /api/auth/register]
        I[POST /api/auth/logout]
        J[POST /api/auth/forgot-password]
        K[POST /api/auth/reset-password]
        L[DELETE /api/auth/account]
    end

    %% Zewnętrzny system autentykacji (Supabase Auth)
    M[Supabase Auth]

    %% Frontend - Chronione strony (dla zalogowanych)
    subgraph "Frontend - Strony Chronione"
        N[MainLayout]
    end

    %% Przepływ interakcji
    A --> B
    B --> C
    B --> D
    B --> E
    B --> F

    C -- "Wysyła dane logowania" --> G
    D -- "Wysyła dane rejestracji" --> H
    E -- "Żądanie resetowania hasła" --> J
    F -- "Reset hasła" --> K

    G -- "Weryfikacja & tworzenie sesji" --> M
    H -- "Tworzenie konta" --> M
    J -- "Inicjacja resetu" --> M
    K -- "Proces resetu" --> M

    M -- "Odpowiedź JWT/Sesja" --> G
    M -- "Odpowiedź JWT/Sesja" --> H
    M -- "Potwierdzenie resetu" --> K

    G -- "Sukces logowania" --> N
    H -- "Sukces rejestracji" --> N
    I -- "Wylogowanie" --> A

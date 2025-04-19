-- Migration: Initial Schema Setup
-- Description: Creates the core tables for the flashcard generation system
-- Tables: generations, flashcards, generation_error_logs
-- Author: AI Assistant
-- Date: 2024-03-21

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Create generations table
create table public.generations (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    model varchar not null,
    generated_count integer not null,
    accepted_unedited_count integer,
    accepted_edited_count integer,
    source_text_hash varchar not null,
    source_text_length integer not null check (source_text_length between 1000 and 10000),
    generation_duration integer not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Create flashcards table
create table public.flashcards (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    generation_id uuid references public.generations(id) on delete cascade,
    front varchar(200) not null,
    back varchar(500) not null,
    source varchar not null check (source in ('ai_full', 'ai_edited', 'manual')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Create generation_error_logs table
create table public.generation_error_logs (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    model varchar not null,
    source_text_hash varchar not null,
    source_text_length integer not null check (source_text_length between 1000 and 10000),
    generation_id uuid not null references public.generations(id) on delete cascade,
    error_code varchar(100) not null,
    error_message text not null,
    created_at timestamptz not null default now()
);

-- Create indexes
create index generations_user_id_idx on public.generations(user_id);
create index flashcards_user_id_idx on public.flashcards(user_id);
create index flashcards_generation_id_idx on public.flashcards(generation_id);
create index generation_error_logs_user_id_idx on public.generation_error_logs(user_id);

-- Enable Row Level Security
alter table public.generations enable row level security;
alter table public.flashcards enable row level security;
alter table public.generation_error_logs enable row level security;

-- RLS Policies for generations
create policy "Users can view their own generations"
    on public.generations for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can insert their own generations"
    on public.generations for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Users can update their own generations"
    on public.generations for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete their own generations"
    on public.generations for delete
    to authenticated
    using (auth.uid() = user_id);

-- RLS Policies for flashcards
create policy "Users can view their own flashcards"
    on public.flashcards for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can insert their own flashcards"
    on public.flashcards for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Users can update their own flashcards"
    on public.flashcards for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete their own flashcards"
    on public.flashcards for delete
    to authenticated
    using (auth.uid() = user_id);

-- RLS Policies for generation_error_logs
create policy "Users can view their own error logs"
    on public.generation_error_logs for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can insert their own error logs"
    on public.generation_error_logs for insert
    to authenticated
    with check (auth.uid() = user_id);

-- Note: Update and Delete policies for error_logs are intentionally omitted
-- as these records should be immutable for audit purposes 
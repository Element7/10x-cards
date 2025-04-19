-- Migration: Disable RLS Policies
-- Description: Drops all RLS policies from flashcards, generations and generation_error_logs tables
-- Author: AI Assistant
-- Date: 2024-03-21

-- Drop policies for generations table
drop policy if exists "Users can view their own generations" on public.generations;
drop policy if exists "Users can insert their own generations" on public.generations;
drop policy if exists "Users can update their own generations" on public.generations;
drop policy if exists "Users can delete their own generations" on public.generations;

-- Drop policies for flashcards table
drop policy if exists "Users can view their own flashcards" on public.flashcards;
drop policy if exists "Users can insert their own flashcards" on public.flashcards;
drop policy if exists "Users can update their own flashcards" on public.flashcards;
drop policy if exists "Users can delete their own flashcards" on public.flashcards;

-- Drop policies for generation_error_logs table
drop policy if exists "Users can view their own error logs" on public.generation_error_logs;
drop policy if exists "Users can insert their own error logs" on public.generation_error_logs;

-- Disable RLS on all tables
alter table public.generations disable row level security;
alter table public.flashcards disable row level security;
alter table public.generation_error_logs disable row level security; 
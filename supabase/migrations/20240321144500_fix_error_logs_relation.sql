-- Migration: Fix Error Logs Relation
-- Description: Removes incorrect foreign key constraint between generation_error_logs and generations
-- Author: AI Assistant
-- Date: 2024-03-21

-- First drop the foreign key constraint
alter table public.generation_error_logs
    drop constraint generation_error_logs_generation_id_fkey;

-- Then drop the generation_id column as it shouldn't be related
alter table public.generation_error_logs
    drop column generation_id; 
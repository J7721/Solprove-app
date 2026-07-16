-- Run in Supabase → SQL Editor (adds username + avatar to family profiles)
alter table profiles add column if not exists username text;
alter table profiles add column if not exists avatar_url text;

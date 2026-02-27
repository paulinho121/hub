create table if not exists public.projetos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.usuarios (id) on delete cascade,
  titulo text not null,
  descricao text,
  context text,
  equipamentos jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists projetos_usuario_id_idx on public.projetos (usuario_id);

alter table if exists public.projetos enable row level security;
alter table if exists public.projetos force row level security;

drop policy if exists projetos_user_access on public.projetos;
create policy projetos_user_access
  on public.projetos
  for all
  using (usuario_id = auth.uid())
  with check (usuario_id = auth.uid());


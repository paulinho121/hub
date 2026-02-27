-- Multi-tenant Row Level Security policies for HubLumi
-- Objetivo: garantir isolamento forte entre:
-- - Clientes (usuarios.tipo_usuario = 'cliente')
-- - Locadoras (usuarios.tipo_usuario = 'locadora')
-- - Super admins (usuarios.tipo_usuario = 'super_admin')
--
-- IMPORTANTE:
-- - Estas políticas assumem que:
--   - A tabela public.usuarios tem colunas: id (UUID) e tipo_usuario (text)
--   - As tabelas usam:
--       reservas.usuario_id   -> id de public.usuarios (cliente)
--       reservas.locadora_id  -> id de public.usuarios (locadora)
--       equipamentos.locadora_id -> id de public.usuarios (locadora)
-- - Ajuste os tipos/nomes se seu schema for diferente.

-- Helper: condição para saber se o usuário autenticado é super_admin
create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.usuarios u
    where u.id = auth.uid()
      and u.tipo_usuario = 'super_admin'
  );
$$;

------------------------------------------------------------------
-- TABELA: usuarios
------------------------------------------------------------------

alter table if exists public.usuarios enable row level security;
alter table if exists public.usuarios force row level security;

-- Cada usuário só pode ver/alterar o próprio registro
drop policy if exists usuarios_self_select on public.usuarios;
create policy usuarios_self_select
  on public.usuarios
  for select
  using (
    id = auth.uid()
    or public.is_super_admin()
  );

drop policy if exists usuarios_self_update on public.usuarios;
create policy usuarios_self_update
  on public.usuarios
  for update
  using (id = auth.uid() or public.is_super_admin())
  with check (id = auth.uid() or public.is_super_admin());

------------------------------------------------------------------
-- TABELA: locadoras
------------------------------------------------------------------

alter table if exists public.locadoras enable row level security;
alter table if exists public.locadoras force row level security;

-- Qualquer usuário autenticado pode ler dados públicos de locadoras
drop policy if exists locadoras_public_select on public.locadoras;
create policy locadoras_public_select
  on public.locadoras
  for select
  using (auth.role() = 'authenticated' or public.is_super_admin());

-- Apenas super_admin pode criar locadoras via painel
drop policy if exists locadoras_admin_insert on public.locadoras;
create policy locadoras_admin_insert
  on public.locadoras
  for insert
  with check (public.is_super_admin());

-- Apenas super_admin pode atualizar/remover locadoras
drop policy if exists locadoras_admin_update on public.locadoras;
create policy locadoras_admin_update
  on public.locadoras
  for update
  using (public.is_super_admin())
  with check (public.is_super_admin());

drop policy if exists locadoras_admin_delete on public.locadoras;
create policy locadoras_admin_delete
  on public.locadoras
  for delete
  using (public.is_super_admin());

------------------------------------------------------------------
-- TABELA: equipamentos
------------------------------------------------------------------

alter table if exists public.equipamentos enable row level security;
alter table if exists public.equipamentos force row level security;

-- Qualquer usuário autenticado pode ver o catálogo
drop policy if exists equipamentos_catalog_select on public.equipamentos;
create policy equipamentos_catalog_select
  on public.equipamentos
  for select
  using (auth.role() = 'authenticated' or public.is_super_admin());

-- Locadora só pode criar equipamentos em seu próprio tenant (locadora_id = auth.uid())
drop policy if exists equipamentos_locadora_insert on public.equipamentos;
create policy equipamentos_locadora_insert
  on public.equipamentos
  for insert
  with check (
    locadora_id = auth.uid()
    or public.is_super_admin()
  );

-- Locadora só pode atualizar/apagar seus próprios equipamentos
drop policy if exists equipamentos_locadora_update on public.equipamentos;
create policy equipamentos_locadora_update
  on public.equipamentos
  for update
  using (
    locadora_id = auth.uid()
    or public.is_super_admin()
  )
  with check (
    locadora_id = auth.uid()
    or public.is_super_admin()
  );

drop policy if exists equipamentos_locadora_delete on public.equipamentos;
create policy equipamentos_locadora_delete
  on public.equipamentos
  for delete
  using (
    locadora_id = auth.uid()
    or public.is_super_admin()
  );

------------------------------------------------------------------
-- TABELA: reservas
------------------------------------------------------------------

alter table if exists public.reservas enable row level security;
alter table if exists public.reservas force row level security;

-- Cliente vê SOMENTE reservas onde ele é o usuario_id
drop policy if exists reservas_cliente_select on public.reservas;
create policy reservas_cliente_select
  on public.reservas
  for select
  using (
    usuario_id = auth.uid()
    or public.is_super_admin()
  );

-- Locadora vê SOMENTE reservas onde ela é a locadora_id
drop policy if exists reservas_locadora_select on public.reservas;
create policy reservas_locadora_select
  on public.reservas
  for select
  using (
    locadora_id = auth.uid()
    or public.is_super_admin()
  );

-- Cliente pode criar reservas apenas para equipamentos válidos;
-- a verificação de consistência de locadora/equipamento é feita aqui.
drop policy if exists reservas_cliente_insert on public.reservas;
create policy reservas_cliente_insert
  on public.reservas
  for insert
  with check (
    -- O usuario_id deve ser o próprio usuário (ou null para reservas anônimas, se permitido)
    (usuario_id is null or usuario_id = auth.uid())
    and
    -- Garante que a locadora_id bate com o equipamento escolhido
    exists (
      select 1
      from public.equipamentos e
      where e.id = reservas.equipamento_id
        and e.locadora_id = reservas.locadora_id
    )
  );

-- Locadora pode atualizar apenas campos de status/logística de reservas do seu tenant
drop policy if exists reservas_locadora_update on public.reservas;
create policy reservas_locadora_update
  on public.reservas
  for update
  using (
    locadora_id = auth.uid()
    or public.is_super_admin()
  )
  with check (
    locadora_id = auth.uid()
    or public.is_super_admin()
  );

-- Apenas super_admin pode deletar reservas (se necessário)
drop policy if exists reservas_admin_delete on public.reservas;
create policy reservas_admin_delete
  on public.reservas
  for delete
  using (public.is_super_admin());


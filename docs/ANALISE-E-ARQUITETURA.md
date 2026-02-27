# Análise e Arquitetura do Software HubLumi

Este documento descreve a análise do sistema e como estão organizados os **três perfis**: **usuário** (ver equipamentos e locadoras), **locadora** (painel para administrar locações) e **administrador** (seu painel).

---

## 1. Visão geral da arquitetura

- **Frontend:** React 18 + Vite, Tailwind CSS, React Router.
- **Backend/Dados:** Supabase (Auth + Postgres). Toda a API é feita via cliente Supabase a partir do app.
- **Papéis (roles):** `cliente`, `locadora`, `super_admin` (administrador).

---

## 2. O que cada pessoa vê e faz

### 2.1 Usuário (cliente) – Ver equipamentos e locadoras

- **Catálogo (`/catalogo`):** Lista de equipamentos disponíveis. Cada card já mostra **quem disponibilizou** (nome da locadora): `item.locadoras?.nome || 'Parceiro HubLumi'`. Os dados vêm do Supabase com `equipamentos` + join em `locadoras(nome)`.
- **Detalhe do equipamento (`/equipamento/:id`):** Ver detalhes e **solicitar reserva** (datas, quantidade, dados de contato). Ao confirmar, os dados são salvos em `pendingReservation` e o usuário é enviado para `/reserva`.
- **Finalizar reserva (`/reserva`):** Formulário de dados (nome, email, telefone, entrega, etc.). Ao enviar, a reserva é criada no Supabase via `reservationService.create` e o usuário é redirecionado para `/reserva/confirmacao`.
- **Dashboard do usuário (`/dashboard`):** Perfil editável e **Minhas Reservas** carregadas do Supabase (reservas onde `usuario_id` = usuário logado), com status, datas e valor.

Resumo: o usuário **vê equipamentos**, **vê qual locadora disponibilizou** (no catálogo) e **administra suas reservas** no próprio dashboard.

---

### 2.2 Locadora – Painel para administrar locações

- **Acesso:** Login com conta cujo `tipo_usuario === 'locadora'`. O link “Dashboard” na nav leva para `/locadora/dashboard`.
- **Dashboard Locadora (`/locadora/dashboard`):**
  - **Produtos:** Lista dos **próprios equipamentos** da locadora (`getEquipamentosByLocadora(user.id)`).
  - **Hub Blind:** Equipamentos de **outras locadoras** (somente leitura).
  - **Novo:** Formulário para cadastrar novo equipamento (`EquipmentRegistrationForm` → Supabase).
  - **Pedidos:** Lista de **reservas** em que a locadora é a responsável (`reservas` com `locadora_id === user.id`), com status e dados do cliente.

Assim, a locadora **administra suas locações** (seus produtos e os pedidos/reservas que a envolvem) em um único painel.

---

### 2.3 Administrador (super_admin) – Seu painel

- **Acesso:** Login com conta `tipo_usuario === 'super_admin'`. Pode usar `/super-admin-login`. O link “Dashboard” na nav leva para `/admin/dashboard`.
- **Painel Admin (`/admin/dashboard` – `SuperAdminDashboard`):**
  - **Equipamentos:** Lista geral com realtime, seed, importador e formulário de cadastro.
  - **Locadoras:** Lista de locadoras com toggle de ativo/inativo.
  - **Reservas:** Todas as reservas do sistema, com status e logística.
  - **Logística:** Torre de controle (entregas, pickups, status).
  - **Cadastro:** Formulário de registro de equipamento.

Ou seja, você tem um **painel único de administrador** para equipamentos, locadoras, reservas e logística.

---

## 3. Fluxo de dados principal

1. **Equipamentos:** Tabela `equipamentos` com `locadora_id`. No catálogo e no detalhe usa-se `equipamentos` + `locadoras(nome)` para mostrar quem disponibilizou.
2. **Reservas:** Tabela `reservas` com `equipamento_id`, `locadora_id`, `usuario_id`, datas, valor, status, e campos de logística (já na migration). Criação na página `/reserva` via `reservationService.create`.
3. **Usuários:** Supabase Auth + tabela `usuarios` (id = auth uid, `tipo_usuario`: cliente, locadora, super_admin).

---

## 4. Ajustes já feitos nesta análise

- **Cadastro (signup):** `AuthContext` agora expõe `signup` e cria usuário no Auth + registro em `usuarios` com `tipo_usuario: 'cliente'`, para a página de cadastro funcionar.
- **Rotas de reserva:** Incluídas `/reserva` e `/reserva/confirmacao` no `App.jsx`.
- **ReservationPage:** Passou a usar `reservationService.create` e Auth (dados do usuário logado) e redireciona para `/reserva/confirmacao` com estado (reserva + item).
- **UserDashboard:** “Minhas Reservas” passaram a ser carregadas do Supabase por `usuario_id`, em vez de localStorage.
- **Navigation:** Ícones do menu mobile (Aperture, Grid, MapPin) importados corretamente.

---

## 5. Banco de dados – Tabela `reservas`

Para a criação de reserva funcionar corretamente, a tabela `reservas` no Supabase deve ter (além dos campos que você já usa):

- Identificação: `equipamento_id`, `locadora_id`, `usuario_id` (pode ser null se permitir reserva sem login).
- Datas e valor: `data_inicio`, `data_fim`, `quantidade`, `valor_total`.
- Status: `status`, `logistica_status`.
- Logística: `modalidade_entrega`, `endereco_entrega`, `valor_frete` (já na migration).
- Opcional (para exibir/contato): `customer_name`, `customer_email`, `customer_phone`, `customer_whatsapp`, `customer_company`. Se ainda não existirem, é preciso adicionar essas colunas ou remover esses campos do payload em `ReservationPage.jsx`.

---

## 6. Resumo por necessidade

| Necessidade | Onde está |
|-------------|-----------|
| Usuário **ver equipamentos** | `/catalogo` e `/equipamento/:id` |
| Usuário **ver quem disponibilizou** (locadora) | Catálogo e detalhe já mostram `locadoras.nome` |
| Usuário **ver/administrar suas reservas** | `/dashboard` → “Minhas Reservas” (Supabase) |
| Locadora **administrar suas locações** | `/locadora/dashboard` (produtos + pedidos/reservas) |
| Você **painel de administrador** | `/admin/dashboard` (equipamentos, locadoras, reservas, logística) |

Se quiser, na próxima etapa podemos: (1) conferir o schema exato da tabela `reservas` no Supabase e um script de migration para os campos de cliente, ou (2) ajustar textos/UX de alguma tela específica.

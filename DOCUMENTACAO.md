# 📋 Documentação Completa — Bolão Lucas Pepineli

## Copa do Mundo FIFA 2026

---

## 📌 Sumário

1. [Visão Geral](#1-visão-geral)
2. [Stack Tecnológica](#2-stack-tecnológica)
3. [Arquitetura do Sistema](#3-arquitetura-do-sistema)
4. [Funcionalidades](#4-funcionalidades)
5. [Fluxo do Usuário](#5-fluxo-do-usuário)
6. [Regras do Bolão](#6-regras-do-bolão)
7. [Sistema de Pontuação](#7-sistema-de-pontuação)
8. [Critérios de Desempate](#8-critérios-de-desempate)
9. [Planos (Free vs Premium)](#9-planos-free-vs-premium)
10. [Painel Administrativo](#10-painel-administrativo)
11. [Banco de Dados](#11-banco-de-dados)
12. [APIs](#12-apis)
13. [Estrutura de Pastas](#13-estrutura-de-pastas)
14. [Variáveis de Ambiente](#14-variáveis-de-ambiente)
15. [Deploy](#15-deploy)
16. [Manutenção e Operações](#16-manutenção-e-operacoes)
17. [Cronograma da Copa 2026](#17-cronograma-da-copa-2026)

---

## 1. Visão Geral

O **Bolão Lucas Pepineli** é um sistema web para realização de bolões da Copa do Mundo FIFA 2026. O sistema permite que participantes façam palpites em todos os 104 jogos da Copa, acompanhem resultados em tempo real e concorram a um prêmio financeiro.

### Características Principais

- **104 jogos** cobertos (72 fase de grupos + 32 mata-mata)
- **Sistema de pontuação** 10/5/3/0 pontos
- **Dois planos**: Grátis (acompanha) e Premium (concorre ao prêmio)
- **Painel administrativo** para gestão de jogos e resultados
- **Ranking** com critérios de desempate
- **Design responsivo** para desktop e mobile
- **Pagamento via Pix** para planos premium

---

## 2. Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| **Frontend** | Next.js 15 (App Router) |
| **UI** | Tailwind CSS + shadcn/ui |
| **Backend** | Next.js API Routes |
| **Banco de Dados** | PostgreSQL (Neon) |
| **ORM** | Prisma |
| **Autenticação** | JWT (NextAuth.js v4) |
| **Deploy** | Vercel |
| **Versionamento** | GitHub |

---

## 3. Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Páginas    │  │  Componentes│  │  API Client         │ │
│  │  (React)    │  │  (UI)       │  │  (fetch)            │ │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘ │
└─────────┼────────────────┼────────────────────┼─────────────┘
          │                │                    │
          ▼                ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                      SERVIDOR                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  API Routes                           │  │
│  │  /api/auth/*  /api/matches/*  /api/bets/*            │  │
│  │  /api/admin/* /api/payments/*                        │  │
│  └──────────────────────────┬───────────────────────────┘  │
│                             │                               │
│  ┌──────────────────────────▼───────────────────────────┐  │
│  │                  Prisma ORM                           │  │
│  └──────────────────────────┬───────────────────────────┘  │
└─────────────────────────────┼───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  PostgreSQL (Neon)                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  User    │  │  Match   │  │  Bet     │  │ Payment  │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Funcionalidades

### 4.1 Para Participantes

| Funcionalidade | Descrição |
|----------------|-----------|
| **Cadastro** | Criar conta com nome, email e senha |
| **Escolha de Plano** | Selecionar entre Grátis ou Premium (R$ 50) |
| **Fazer Palpites** | Preencher placar de todos os 104 jogos |
| **Ver Palpites** | Relatório completo dos palpites enviados |
| **Acompanhar Resultados** | Ver placares reais na página inicial |
| **Ver Ranking** | Classificação geral e premium |
| **Contato WhatsApp** | Botão flutuante para suporte |

### 4.2 Para Administrador

| Funcionalidade | Descrição |
|----------------|-----------|
| **Gerenciar Jogos** | Criar, editar e encerrar jogos |
| **Inserir Resultados** | Definir placar real de cada jogo |
| **Corrigir Resultados** | Editar resultado com recálculo automático de pontos |
| **Confirmar Pagamentos** | Aprovar pagamentos premium |
| **Ver Financeiro** | Resumo de arrecadado e prêmio |
| **Ver Ranking** | Ranking completo com estatísticas |

---

## 5. Fluxo do Usuário

### 5.1 Fluxo de Cadastro

```
Acessar /cadastro
      │
      ▼
Preencher nome, email, senha
      │
      ▼
Criar Conta
      │
      ▼
Escolher Plano (/escolher-plano)
      │
      ├──► Grátis ──► Acessar bolão
      │
      └──► Premium ──► Gerar Pix
                            │
                            ▼
                    Enviar comprovante
                            │
                            ▼
                    Admin confirma pagamento
                            │
                            ▼
                    Conta liberada como Premium
```

### 5.2 Fluxo de Palpites

```
Acessar /palpites/novo
      │
      ▼
Preencher placar dos 104 jogos
      │
      ▼
Barra de progresso: X/104 preenchidos
      │
      ▼
Botão "Salvar" habilitado (104/104)
      │
      ▼
Clicar "Salvar Todos os Palpites"
      │
      ▼
Palpites salvos e TRAVADOS
      │
      ▼
Redireciona para /palpites (relatório read-only)
```

### 5.3 Fluxo de Resultados

```
Admin insere resultado real do jogo
      │
      ▼
Sistema recalcula pontos automaticamente
      │
      ▼
Atualiza pontuação de cada usuário
      │
      ▼
Resultados aparecem na página inicial
      │
      ▼
Ranking é atualizado
```

---

## 6. Regras do Bolão

### 6.1 Regras Gerais

1. **Prazo dos palpites**: Podem ser feitos ou alterados até o apito inicial de cada partida
2. **Jogos encerrados**: Quando o admin inserir o resultado real, os pontos são calculados automaticamente
3. **Mata-mata**: Considere apenas o placar do tempo normal (incluindo acréscimos). Prorrogação e pênaltis não contam
4. **Integridade**: Cada participante pode ter apenas uma conta
5. **Prêmio**: Apenas participantes Premium concorrem ao prêmio

### 6.2 Cobertura

| Fase | Jogos | Período |
|------|-------|---------|
| Fase de Grupos | 72 | 11 a 27 de Junho |
| Oitavas de Final | 16 | 28 Jun a 1 Jul |
| Oitavas Final | 8 | 3 a 6 de Julho |
| Quartas de Final | 4 | 9 a 11 de Julho |
| Semifinais | 2 | 14 e 15 de Julho |
| Disputa 3º Lugar | 1 | 18 de Julho |
| Final | 1 | 19 de Julho |
| **Total** | **104** | |

---

## 7. Sistema de Pontuação

| Resultado | Pontos | Descrição |
|-----------|--------|-----------|
| 🟢 **Placar Exato** | 10 pts | Acertar o resultado e os gols de ambos os times |
| 🔵 **Gols de Um Time** | 5 pts | Acertar o resultado e o número de gols de um dos times |
| 🟡 **Vencedor / Empate** | 3 pts | Acertar apenas quem venceu (ou que empatou), sem os gols |
| 🔴 **Errou** | 0 pts | Não acertou o vencedor nem o empate |

### 7.1 Exemplos

**Jogo: Brasil 2 × 1 Argentina**

| Palpite | Resultado | Pontos |
|---------|-----------|--------|
| 2 × 1 | Placar exato | **10 pts** |
| 2 × 0 | Acertou gols do Brasil | **5 pts** |
| 3 × 1 | Acertou gols da Argentina | **5 pts** |
| 3 × 2 | Só acertou vitória do Brasil | **3 pts** |
| 1 × 2 | Errou tudo | **0 pts** |

### 7.2 Lógica do Sistema

```typescript
// Placar exato → 10 pts
if (betHome === realHome && betAway === realAway) return 10;

// Mesmo vencedor E acertou gols de um time → 5 pts
if (betWinner === realWinner) {
  if (betHome === realHome || betAway === realAway) return 5;
  // Só acertou vencedor → 3 pts
  return 3;
}

// Errou → 0 pts
return 0;
```

---

## 8. Critérios de Desempate

Caso dois ou mais participantes terminem com a mesma pontuação, o desempate será feito na seguinte ordem:

| Ordem | Critério | Descrição |
|-------|----------|-----------|
| 1º | Mais placares exatos | Quem acertou mais resultados com 10 pts |
| 2º | Mais palpites com 5 pts | Quem acertou mais gols de um time |
| 3º | Menos palpites em branco | Quem menos deixou de palpitar |
| 4º | Ordem de cadastro | Quem se cadastrou primeiro no bolão |

---

## 9. Planos (Free vs Premium)

### 🆓 Plano Grátis

- ✅ Palpites em todos os jogos
- ✅ Ranking geral
- ✅ Acompanhar resultados
- ❌ **Sem direito ao prêmio**

### 👑 Plano Premium — R$ 10

- ✅ Palpites em todos os jogos
- ✅ Ranking premium exclusivo
- ✅ **Concorre ao prêmio final (80% do total arrecadado)**
- 💰 Pagamento via Pix

### 9.1 Cálculo do Prêmio

```
Prêmio = Total Arrecadado × 80%
Taxa Admin = Total Arrecadado × 20%
```

| Participantes Premium | Total Arrecadado | Taxa (20%) | Prêmio (80%) |
|-----------------------|------------------|------------|--------------|
| 5 | R$ 50 | R$ 10 | **R$ 40** |
| 10 | R$ 100 | R$ 20 | **R$ 80** |
| 20 | R$ 200 | R$ 40 | **R$ 160** |
| 30 | R$ 300 | R$ 60 | **R$ 240** |
| 50 | R$ 500 | R$ 100 | **R$ 400** |

### 9.2 Pagamento do Prêmio

- O prêmio é pago **exclusivamente** ao participante premium com maior pontuação
- Pagamento via **Pix** em até **7 dias** após o término da Copa
- Em caso de empate, os critérios de desempate são aplicados

---

## 10. Painel Administrativo

### 10.1 Acesso

- **URL**: `/admin`
- **Usuário**: `lucaspepineliviso@gmail.com`
- **Senha**: Definida pelo administrador no banco de dados

### 10.2 Aba Jogos

| Ação | Descrição |
|------|-----------|
| **Criar Jogo** | Adicionar novo jogo manualmente |
| **Editar Jogo** | Alterar times, data, fase ou grupo |
| **Inserir Resultado** | Definir placar real e encerrar jogo |
| **Corrigir Resultado** | Alterar resultado com recálculo de pontos |
| **Ver Palpites** | Visualizar palpites dos participantes |

### 10.3 Aba Financeiro

| Métrica | Descrição |
|---------|-----------|
| **Total Premium** | Número de participantes premium |
| **Pendentes** | Pagamentos aguardando confirmação |
| **Total Bruto** | Soma de todos os pagamentos |
| **Prêmio (80%)** | Valor disponível para premiação |
| **Líder Atual** | Participante com mais pontos |

### 10.4 Fluxo de Pagamento

```
Usuário clica "Quero Premium"
      │
      ▼
Sistema gera ID de pagamento
      │
      ▼
Usuário vê dados Pix para pagamento
      │
      ▼
Usuário envia comprovante ao admin
      │
      ▼
Admin clica "Confirmar Pagamento"
      │
      ▼
Conta do usuário é marcada como Premium
```

---

## 11. Banco de Dados

### 11.1 Modelo de Dados

```prisma
model User {
  id        Int       @id @default(autoincrement())
  name      String
  email     String    @unique
  password  String
  role      String    @default("USER")
  isPremium Boolean   @default(false)
  createdAt DateTime  @default(now())
  points    Int       @default(0)
  bets      Bet[]
  payments  Payment[]
}

model Match {
  id        Int      @id @default(autoincrement())
  homeTeam  String
  awayTeam  String
  matchDate DateTime
  stage     String
  groupName String?
  homeScore Int?
  awayScore Int?
  isFinished Boolean @default(false)
  bets      Bet[]
}

model Bet {
  id        Int      @id @default(autoincrement())
  userId    Int
  matchId   Int
  homeScore Int
  awayScore Int
  points    Int?
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
  match     Match    @relation(fields: [matchId], references: [id])
  @@unique([userId, matchId])
}

model Payment {
  id            Int       @id @default(autoincrement())
  userId        Int
  amount        Float     @default(50)
  status        String    @default("pending")
  paymentMethod String?
  paidAt        DateTime?
  createdAt     DateTime  @default(now())
  user          User      @relation(fields: [userId], references: [id])
}
```

### 11.2 Relações

```
User (1) ──── (N) Bet
Match (1) ──── (N) Bet
User (1) ──── (N) Payment
```

### 11.3 Estados

| Modelo | Campo | Estados |
|--------|-------|---------|
| User | `role` | `USER`, `ADMIN` |
| User | `isPremium` | `true`, `false` |
| Match | `isFinished` | `true`, `false` |
| Payment | `status` | `pending`, `paid` |

---

## 12. APIs

### 12.1 Autenticação

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/api/auth/register` | Cadastrar novo usuário |
| `POST` | `/api/auth/login` | Fazer login |
| `DELETE` | `/api/auth/login` | Fazer logout |
| `GET` | `/api/auth/me` | Obter usuário logado |

### 12.2 Jogos

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `GET` | `/api/matches` | Listar todos os jogos | Não |
| `GET` | `/api/admin/matches` | Listar jogos (admin) | Admin |
| `POST` | `/api/admin/matches` | Criar jogo | Admin |
| `PUT` | `/api/admin/matches` | Definir resultado | Admin |
| `PATCH` | `/api/admin/matches` | Editar jogo | Admin |

### 12.3 Palpites

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `GET` | `/api/bets` | Listar palpites do usuário | Sim |
| `POST` | `/api/bets` | Salvar palpite individual | Sim |
| `POST` | `/api/bets/bulk` | Salvar palpites em lote | Sim |

### 12.4 Pagamentos

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `POST` | `/api/payments` | Solicitar pagamento | Sim |
| `GET` | `/api/payments` | Listar pagamentos do usuário | Sim |
| `GET` | `/api/admin/payments` | Listar todos os pagamentos | Admin |
| `PUT` | `/api/admin/payments` | Confirmar pagamento | Admin |

### 12.5 Ranking e Estatísticas

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `GET` | `/api/admin/ranking` | Ranking de todos | Não |
| `GET` | `/api/admin/premium-stats` | Estatísticas financeiras | Admin |

---

## 13. Estrutura de Pastas

```
bolao-lucas-pepineli/
├── app/
│   ├── admin/
│   │   └── page.tsx              # Painel administrativo
│   ├── api/
│   │   ├── admin/
│   │   │   ├── matches/route.ts  # CRUD jogos (admin)
│   │   │   ├── payments/route.ts # Pagamentos (admin)
│   │   │   ├── premium-stats/route.ts
│   │   │   └── ranking/route.ts  # Ranking
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── me/route.ts
│   │   │   └── register/route.ts
│   │   ├── bets/
│   │   │   ├── bulk/route.ts     # Palpites em lote
│   │   │   └── route.ts          # Palpites individuais
│   │   ├── matches/route.ts      # Jogos públicos
│   │   └── payments/route.ts     # Pagamentos
│   ├── cadastro/
│   │   └── page.tsx              # Cadastro
│   ├── escolher-plano/
│   │   └── page.tsx              # Seleção de plano
│   ├── login/
│   │   └── page.tsx              # Login
│   ├── palpites/
│   │   ├── novo/
│   │   │   └── page.tsx          # Novo palpite (104 jogos)
│   │   └── page.tsx              # Meus palpites (relatório)
│   ├── premium/
│   │   └── pendente/
│   │       └── page.tsx          # Pagamento pendente
│   ├── ranking/
│   │   └── page.tsx              # Ranking
│   ├── regras/
│   │   └── page.tsx              # Regras do bolão
│   ├── layout.tsx                # Layout principal
│   ├── page.tsx                  # Página inicial (resultados)
│   └── globals.css               # Estilos globais
├── components/
│   ├── BetModal.tsx              # Modal de palpite individual
│   ├── Celebration.tsx           # Animação de sucesso
│   ├── FailureAnimation.tsx      # Animação de erro
│   ├── GroupStageForm.tsx        # Formulário fase de grupos
│   ├── Header.tsx                # Cabeçalho/navegação
│   ├── MatchCard.tsx             # Card de jogo
│   ├── PrizeDisplay.tsx          # Exibição do prêmio
│   └── WhatsAppButton.tsx        # Botão WhatsApp
├── lib/
│   ├── auth.ts                   # Autenticação JWT
│   ├── client-auth.ts            # Auth no cliente
│   ├── prisma.ts                 # Cliente Prisma
│   └── utils.ts                  # Utilitários (calculatePoints)
├── prisma/
│   ├── schema.prisma             # Modelo de dados
│   └── seed.ts                   # Seed do banco
├── public/
│   └── Bolao_Lucas_Pepineli.png  # Logo
├── .env.local                    # Variáveis de ambiente
├── next.config.ts                # Configuração Next.js
├── package.json                  # Dependências
├── tailwind.config.ts            # Configuração Tailwind
└── tsconfig.json                 # Configuração TypeScript
```

---

## 14. Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | URL de conexão com Neon | `postgresql://...` |
| `DIRECT_URL` | URL direta Neon (migrations) | `postgresql://...` |
| `NEXTAUTH_SECRET` | Segredo para JWT | `abc123...` |
| `NEXTAUTH_URL` | URL do site | `https://bolao-lucas-pepineli.vercel.app` |

---

## 15. Deploy

### 15.1 Plataforma

- **Frontend + Backend**: Vercel (auto-deploy via GitHub)
- **Banco de Dados**: Neon (PostgreSQL)
- **Repositório**: GitHub (`lucaspepineliviso/bolao-lucas-pepineli`)

### 15.2 Processo de Deploy

```
git push origin main
      │
      ▼
Vercel detecta mudança
      │
      ▼
Build automático
      │
      ▼
Deploy em produção
      │
      ▼
https://bolao-lucas-pepineli.vercel.app
```

### 15.3 URL de Produção

```
https://bolao-lucas-pepineli.vercel.app
```

---

## 16. Manutenção e Operações

### 16.1 Seed do Banco

O seed (`prisma/seed.ts`) cria os 104 jogos oficiais da Copa 2026.

**Importante**: O seed é SEGURO — se os jogos já existirem, ele não deleta nada, preservando usuários, palpites e pagamentos.

```bash
npx tsx prisma/seed.ts
```

### 16.2 Backup

O Neon oferece backups automáticos. Para backup manual:

```bash
pg_dump $DATABASE_URL > backup.sql
```

### 16.3 Monitoramento

| Verificar | Como |
|-----------|------|
| Usuários cadastrados | Query SQL ou painel admin |
| Palpites salvos | Query SQL ou painel admin |
| Pagamentos pendentes | Painel admin > Financeiro |
| Erros de API | Logs do Vercel |

### 16.4 Comandos Úteis

```bash
# Verificar usuários
npx tsx check-users.ts

# Verificar jogos
npx tsx check-matches.ts

# Rodar seed (seguro)
npx tsx prisma/seed.ts

# Gerar cliente Prisma
npx prisma generate

# Push schema para banco
npx prisma db push
```

---

## 17. Cronograma da Copa 2026

| Data | Fase |
|------|------|
| 11 Jun | Início da Copa |
| 11-27 Jun | Fase de Grupos |
| 28 Jun - 1 Jul | Oitavas de Final |
| 3-6 Jul | Oitavas Final |
| 9-11 Jul | Quartas de Final |
| 14-15 Jul | Semifinais |
| 18 Jul | Disputa de 3º Lugar |
| 19 Jul | **FINAL** |
| 28 Jun | **Prazo final para palpites** |

---

## 📞 Contato

- **WhatsApp**: +55 11 97073-3359
- **Email do Admin**: lucaspepineliviso@gmail.com

---

*Documentação gerada em Junho de 2026*
*Bolão Lucas Pepineli — Copa do Mundo FIFA 2026*

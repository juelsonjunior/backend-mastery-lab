# Backend Mastery Lab

Um ambiente de estudo intenso e profissional para dominar o desenvolvimento back-end moderno.

> Este projeto é uma verdadeira "academia de treino" para desenvolvedores que buscam domínio técnico em APIs, autenticação, segurança, boas práticas e qualquer outro tema relevante do universo back-end. Ideal para quem está se especializando a sério e quer demonstrar progresso técnico real no portfólio ou GitHub.

Aqui, cada feature foi pensada para simular desafios reais de produção, com foco em aprendizado prático, robustez e evolução contínua. O objetivo é criar um laboratório de experimentação e aprimoramento, onde toda nova técnica, padrão ou conceito aprendido pode ser implementado, testado e documentado — não apenas temas de segurança, mas tudo que for relevante para back-end.

---

## 📚 Tecnologias Utilizadas

- Node.js + Express
- MongoDB + Mongoose
- JWT (access & refresh token)
- Redis (para blacklist de tokens)
- Docker (para ambiente de desenvolvimento)
- bcrypt (hash de senhas)
- dotenv (variáveis de ambiente)
- Postman (testes manuais)

---

## 🔐 Funcionalidades de Autenticação

- Registro de usuário
- Login com access token e refresh token
- Atualização de senha (requer senha atual)
- Logout com remoção de refresh token específico
- Reautenticação para ações críticas (ex: deletar conta)
- Refresh de token com controle por dispositivo

---

## 🔓 Autorização e Controle de Acesso

- Proteção de rotas com middleware `verifyToken`
- Middleware `authorize(...)` para papéis como `admin`, `mod`, `user`
- Rotas privadas para diferentes perfis de usuário

---

## 🧠 Funcionalidades Avançadas

- Blacklist de access tokens (em memória ou Redis)
- Expiração manual de refresh tokens no banco
- Bloqueio temporário após múltiplas tentativas de login incorretas
- Soft delete de usuários (`active: false`)
- Logs de login, logout, atualização de perfil/senha e acessos a rotas protegidas
- Visualização de todos os refresh tokens ativos por usuário
- Atualização de perfil (nome/email)

---

## 📈 Features Detalhadas

1. **Atualizar Senha**
   - PATCH `/api/auth/update-password`
   - Requer token de acesso, senha atual e nova senha
   - Validação com bcrypt

2. **Proteção de Rotas com Papéis**
   - Exemplo: `authorize('admin', 'mod')`
   - Exemplo de rota: GET `/api/admin/dashboard`

3. **Gerenciamento de Múltiplos Refresh Tokens**
   - Cada token vinculado a userId, userAgent, IP, data de criação
   - Logout remove apenas o token do dispositivo atual

4. **Blacklist de JWT**
   - Tokens revogados são mantidos em memória ou Redis por tempo limitado

5. **Reautenticação para Ações Críticas**
   - Exemplo: deletar conta exige senha novamente

6. **Logs de Ações e Acessos**
   - Login, logout, atualização de perfil/senha, acesso a rotas admin

7. **Expiração Manual de Refresh Token**
   - Verificação de validade a cada uso

8. **Bloqueio de Conta por Múltiplos Logins Errados**
   - Após 3 tentativas, bloqueia a conta por tempo 5 min

9. **Desativação de Usuários (Soft Delete)**
   - Campo `active` no usuário(só para admins e moderadores)

10. **Rotas Privadas para Perfis Diferentes**
    - Exemplo: `/profile`, `/admin/dashboard`, `/me/tokens`

---

## 🧪 Em Aprendizado / Futuras Features

- OAuth2 com GitHub ou Google
- Testes automatizados com Jest/Supertest
- Auditoria de logs com Winston
- Throttling e Rate Limit
- Assinatura JWT com RS256
- Middleware de escopo (ex: `['read:user', 'edit:product']`)

---

## 📂 Estrutura de Pastas

```
src/
│
├── controllers/
├── service/
├── middlewares/
├── models/
├── repository/
├── routes/
├── utils/
├── database/
└── server.js
```

---

## 🚀 Como rodar o projeto

```bash
# 1. Clone o projeto
git clone https://github.com/juelsonjunior/backend-mastery-lab.git

# 2. Instale as dependências
npm install

# 3. Configure o .env
cp .env.example .env
# Edite as variáveis com suas chaves JWT, URIs, etc.

# 4. (Opcional) Suba MongoDB e Redis com Docker
docker-compose up -d

# 5. Rode a aplicação
npm run dev
```

---

## 📝 Contribua!

Este projeto é um laboratório de aprendizado. Sinta-se à vontade para sugerir novas features, abrir issues ou enviar PRs com melhorias e novas ideias! 

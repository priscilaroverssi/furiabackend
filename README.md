# 📁 Backend FURIA 🦾🔥

Este diretório reúne todas as **rotas principais da API** do projeto **FURIA Fan Experience**, responsável por conectar os dados do frontend com o backend e o Firebase.

Cada arquivo aqui define um conjunto de rotas para lidar com diferentes funcionalidades da aplicação, como **login**, **perfil**, **quiz**, **resultados** e **validação de tokens**.

---

## 🌐 Visão Geral

| Arquivo                 | Função Principal                                                                 |
| ----------------------- | -------------------------------------------------------------------------------- |
| `authRoutes.ts`         | Login e cadastro de usuários via Firebase Authentication                         |
| `profileRoutes.ts`      | Criação e atualização do perfil do fã (nome, idade, cidade, jogos favoritos etc) |
| `quizRoutes.ts`         | Recebe e armazena respostas do quiz interativo                                   |
| `resultRoutes.ts`       | Envia os resultados finais com base na pontuação do quiz                         |
| `validateTokenRoute.ts` | Verifica se o token enviado no frontend é válido (middleware de segurança)       |

---

## 🧩 Detalhes Técnicos

### ✅ Autenticação: `authRoutes.ts`

* Utiliza o Firebase para autenticar usuários por **email/senha** ou **Google**.
* Responde com mensagens de sucesso ou erro personalizadas.
* Rota de login: `POST /api/auth/login`
* Rota de cadastro: `POST /api/auth/register`

### 🙋 Perfil do Fã: `profileRoutes.ts`

* Permite ao usuário preencher ou atualizar seu perfil.
* Dados armazenados: nome, idade, cidade, jogos favoritos e jogador favorito da FURIA.
* Rota: `POST /api/profile`

### 🧠 Quiz Interativo: `quizRoutes.ts`

* Armazena as respostas enviadas pelo usuário após o quiz.
* Serve como base para calcular o tipo de fã e preferências.
* Rota: `POST /api/quiz`

### 🏆 Resultado: `resultRoutes.ts`

* Recebe a pontuação final e retorna um "tipo de fã" com base nas respostas.
* Pode ser usado para personalizar a experiência do usuário com conteúdos FURIA.
* Rota: `POST /api/result`

### 🔒 Validação de Token: `validateTokenRoute.ts`

* Middleware para proteger rotas privadas e verificar se o usuário está autenticado.
* Utiliza `admin.auth().verifyIdToken()` do Firebase Admin SDK.
* Rota: `POST /api/validate`

---

## 🚀 Como funciona a integração?

1. O frontend envia uma requisição para a rota apropriada.
2. O backend trata os dados, interage com o Firebase (Realtime Database e Authentication).
3. As respostas são devolvidas ao frontend com mensagens claras, status HTTP e segurança.

---

## 📦 Tecnologias Utilizadas

* Node.js + Express
* Firebase Admin SDK
* Middleware personalizado
* Estrutura modular de rotas
* Integração com frontend React (FURIA Fan Experience)

---

## ✨ Sugestão de Expansão Futuras

* Adicionar logs de atividade do usuário
* Criar rotas de estatísticas dos fãs
* Incluir autenticação por redes sociais adicionais (Ex: Twitter, Twitch)

---

Se quiser, posso adaptar esse conteúdo direto no seu README do repositório ou criar um arquivo separado só para a pasta `routes`. Deseja isso?

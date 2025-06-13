
# 🏬 Market‑Hub Backend

Servidor da aplicação de marketplace de múltiplos vendedores, desenvolvido com **Node.js**, **Express** e **PostgreSQL**.

---

## 🔍 Descrição

Backend da aplicação **Market‑Hub**, responsável por:

- Gerenciamento de produtos, estoques, categorias e imagens  
- Autenticação de usuários  
- CRUD completo de usuários e pedidos  
- Controle de estoque durante transações  
- Integração com o front-end via API RESTful

---

## 🚀 Tecnologias

- Node.js + Express  
- PostgreSQL com ORM  
- JWT para autenticação  
- Bcrypt para hashing de senhas  
- Multer para upload de imagens  
- Dotenv, Cors e outros middlewares úteis

---

## ⚙️ Pré-requisitos

- Node.js v16+  
- PostgreSQL local ou em nuvem  
- Git

---

## 📥 Instalação

```bash
git clone https://github.com/MandaAlmeida/market-hub.git
cd market-hub/backend
npm install
cp .env.sample .env
```

### ✏️ Configure o arquivo `.env` com:

```env
# Porta onde o backend será iniciado
PORT=3333

# URL de conexão com o banco de dados PostgreSQL
# Formato: postgres://usuario:senha@host:porta/nome_do_banco
DATABASE_URL=postgres://admin:senha123@localhost:5432/market_hub

# Google OAuth – credenciais da aplicação
CLIENT_ID_GOOGLE=1234567890-abc123def456.apps.googleusercontent.com
CLIENT_SECRET_GOOGLE=GOCSPX-exampleSecretKeyHere
URL_GOOGLE=https://accounts.google.com/o/oauth2/v2/auth

# URL do front-end para redirecionamentos (login, cadastro, etc.)
URL_FRONTEND=https://market-hub-front.vercel.app

# Cloudflare – ID da conta para gerenciamento de imagens (R2, Workers, etc.)
CLOUDFLARE_ACCOUNT_ID=abcdef1234567890abcdef1234567890

# URL pública base para exibir imagens armazenadas (em Cloudflare R2, por exemplo)
URL_PUBLIC_GET_IMAGE=https://pub-abc123.r2.dev/

# AWS S3 – informações para upload de imagens em bucket privado/público
AWS_BUCKET_NAME=market-hub-images
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# JWT – chaves RSA (use arquivos .pem ou variáveis de ambiente para tokens assinados)
JWT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----
MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAMexampleKeyAqui...
-----END PRIVATE KEY-----

JWT_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDexampleKeyAqui...
-----END PUBLIC KEY-----
```

---

## 🏃 Execução

```bash
npm run dev
```

O backend estará disponível em: [http://localhost:3333](http://localhost:3333)

---

## 📡 Rotas da API

Rotas conforme os controllers em `src/controllers`:

### 📂 CategoryController (categoryController.ts)
- `POST /category` – Criar uma nova categoria (somente ADMIN)
- `GET /category` – Listar todas as categorias
- `PUT /category/:id` – Atualizar categoria pelo ID
- `DELETE /category/:id` – Remover categoria pelo ID (somente ADMIN)

### 📂 SubCategoryController (subCategoryController.ts)
- `POST /subcategory` – Criar uma nova subcategoria (somente ADMIN)
- `POST /subcategory/createSubCategories` – Criar múltiplas subcategorias em lote (somente ADMIN)
- `GET /subcategory` – Listar todas as subcategorias
- `PUT /subcategory/:id` – Atualizar subcategoria pelo ID
- `DELETE /subcategory/:id` – Remover subcategoria pelo ID (somente ADMIN)

### 📦 ItensOrderController (itensOrderController.ts)
- `POST /itensOrder` – Criar itens do pedido (envia lista de itens)
- `GET /itensOrder/:id` – Buscar um item do pedido pelo ID
- `PUT /itensOrder/:id` – Atualizar status de um item do pedido pelo ID
- `DELETE /itensOrder/removeItem/:orderId` – Remover item(s) do pedido pelo ID do pedido (envia item no corpo)

### 🧾 OrdersController (ordersController.ts)
- `POST /orders` – Criar um novo pedido para o usuário autenticado
- `GET /orders/:id` – Buscar pedido pelo ID
- `GET /orders?p=number&l=number` – Listar todos os pedidos do usuário com paginação opcional (p=página, l=limite por página)
- `PUT /orders/:id` – Atualizar o pedido pelo ID (ex: alterar valor total)
- `DELETE /orders/:id` – Remover pedido pelo ID

### 💳 PayController (payController.ts)
- `POST /pay/:orderId` – Criar pagamento para o pedido informado
- `POST /pay/:id/verify` – Verificar pagamento pela transação ID
- `POST /pay/:id/cancel` – Cancelar pagamento pela transação ID
- `GET /pay` – Listar todos os pagamentos do usuário autenticado
- `GET /pay/:orderId` – Listar pagamento pelo ID do pedido

### 📁 UploadController (uploadController.ts)
- `POST /uploads` – Upload de arquivo (usuário com papel SELLER)
- `GET /uploads/:filename` – Obter URL pública para visualização do arquivo
- `DELETE /uploads/:filename` – Deletar arquivo (usuário com papel SELLER)

### 🧑 UserController (userController.ts)
- `POST /user/register` – Registrar novo usuário
- `GET /user/google` – Autenticação via Google OAuth (início do fluxo)
- `GET /user/google/redirect` – Callback do Google OAuth com redirecionamento para frontend (retorna token e flag isNewUser)
- `POST /user/register-oauth` – Completar registro de usuário OAuth (usuário autenticado)
- `POST /user/login` – Login do usuário com email/senha
- `GET /user` – Buscar dados do usuário autenticado
- `PATCH /user/:id` – Atualizar dados do usuário autenticado
- `DELETE /user` – Remover usuário autenticado
---

## ✅ Funcionalidades Implementadas

- Controle de estoque atualizado automaticamente após compras  
- Validação para impedir compra de mais itens do que o disponível  
- Upload de imagens com `multer`  
- Senhas protegidas com `bcrypt`  
- Tokens JWT assinados com chaves RSA para segurança

---

## 📬 Contato

Para dúvidas, sugestões ou contribuições, abra uma issue no repositório ou entre em contato pelo GitHub:

[@MandaAlmeida](https://github.com/MandaAlmeida)

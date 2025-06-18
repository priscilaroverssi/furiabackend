import express from "express";
import cors from "cors";
import admin from "firebase-admin";

const app = express();

// Habilitar CORS para aceitar requisições de outros domínios
app.use(cors());
app.use(express.json()); // Para analisar requisições com corpo em JSON

// Inicializar o Firebase Admin
const serviceAccount = require("./caminho/para/sua/credencial.json"); // Altere para o caminho correto do seu arquivo JSON

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Função para verificar o token do Firebase
const verifyToken = async (token) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken; // Retorna o payload do token
  } catch (error) {
    throw new Error("Token inválido ou expirado");
  }
};

// Endpoint para verificar o token
app.post("/auth/verify-token", async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: "Token não fornecido." });
  }

  try {
    const user = await verifyToken(idToken);
    res.status(200).json({ message: "Usuário autenticado com sucesso", user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Rota de exemplo para o signup (caso você queira registrar o usuário no banco de dados)
app.post("/auth/signup", async (req, res) => {
  const { email, idToken } = req.body;

  try {
    const user = await verifyToken(idToken);

    // Aqui você pode adicionar o código para registrar o usuário no seu banco de dados
    // Por exemplo, salvar o email no banco (MongoDB, MySQL, etc.)

    res.status(201).json({ message: "Usuário registrado com sucesso", user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Iniciar o servidor na porta 5173
app.listen(5173, () => {
  console.log("Servidor rodando na porta 5173");
});

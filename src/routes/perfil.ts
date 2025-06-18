// perfil.ts (atualizado)
import { Router, Request, Response } from "express";
import { db } from "../firebase";

const router = Router();

interface Perfil {
  uid: string;
  nome: string;
  dataNascimento: string;
  cidade: string;
  jogos: string;
  jogadorFavorito: string;
  createdAt: Date;
}

// Salvar perfil no Firestore
router.post("/", async (req: Request, res: Response) => {
  try {
    const { uid, nome, dataNascimento, cidade, jogos, jogadorFavorito } = req.body;

    if (!uid) {
      return res.status(400).json({ error: "UID é obrigatório" });
    }

    if (!nome || !dataNascimento || !cidade || !jogos || !jogadorFavorito) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    const perfil: Perfil = {
      uid,
      nome,
      dataNascimento,
      cidade,
      jogos,
      jogadorFavorito,
      createdAt: new Date()
    };

    await db.collection("perfis").doc(uid).set(perfil);
    res.json({ message: "Perfil salvo com sucesso", success: true });
  } catch (error) {
    console.error("Erro ao salvar perfil:", error);
    res.status(500).json({ error: "Erro interno ao salvar perfil" });
  }
});

// Buscar perfil por UID
router.get("/", async (req: Request, res: Response) => {
  const uid = req.query.uid as string;

  if (!uid) {
    return res.status(400).json({ error: "UID é obrigatório" });
  }

  try {
    const doc = await db.collection("perfis").doc(uid).get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Perfil não encontrado" });
    }

    return res.json(doc.data());
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    return res.status(500).json({ error: "Erro interno ao buscar perfil" });
  }
});

export default router;
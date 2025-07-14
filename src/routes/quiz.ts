// quiz.ts (novo arquivo)
import { Router, Request, Response } from "express";
import { db } from "../firebase";

const router = Router();

interface QuizResult {
  uid: string;
  tipoFa: string;
  maisFa: {
    nome: string;
    estilo: string;
    descricao: string;
    plataforma: string;
  };
  menosFa: {
    nome: string;
    estilo: string;
    descricao: string;
    plataforma: string;
  };
  respostas: number[];
  createdAt: Date;
}

// Salvar resultado do quiz
router.post("/", async (req: Request, res: Response) => {
  try {
    const { uid, tipoFa, maisFa, menosFa, respostas } = req.body;

    if (!uid) {
      return res.status(400).json({ error: "UID é obrigatório" });
    }

    const quizResult: QuizResult = {
      uid,
      tipoFa,
      maisFa,
      menosFa,
      respostas,
      createdAt: new Date()
    };

    await db.collection("quizResults").doc(uid).set(quizResult);
    res.json({ message: "Resultado do quiz salvo com sucesso", success: true });
  } catch (error) {
    console.error("Erro ao salvar resultado do quiz:", error);
    res.status(500).json({ error: "Erro interno ao salvar resultado do quiz" });
  }
});

// Buscar resultado do quiz por UID
router.get("/:uid", async (req: Request, res: Response) => {
  const { uid } = req.params;

  if (!uid) {
    return res.status(400).json({ error: "UID é obrigatório" });
  }

  try {
    const doc = await db.collection("quizResults").doc(uid).get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Resultado do quiz não encontrado" });
    }

    return res.json(doc.data());
  } catch (error) {
    console.error("Erro ao buscar resultado do quiz:", error);
    return res.status(500).json({ error: "Erro interno ao buscar resultado do quiz" });
  }
});

// Deletar resultado do quiz (para refazer)
router.delete("/:uid", async (req: Request, res: Response) => {
  const { uid } = req.params;

  if (!uid) {
    return res.status(400).json({ error: "UID é obrigatório" });
  }

  try {
    await db.collection("quizResults").doc(uid).delete();
    res.json({ message: "Resultado do quiz removido com sucesso", success: true });
  } catch (error) {
    console.error("Erro ao remover resultado do quiz:", error);
    res.status(500).json({ error: "Erro interno ao remover resultado do quiz" });
  }
});

export default router;
import express from "express";
import { auth } from "../firebase"; // Firebase Admin SDK
import { DecodedIdToken, UserRecord } from "firebase-admin/auth";

const router = express.Router();


// Tipos de resposta padronizados
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: string;
  };
}

interface UserAuthData {
  uid: string;
  email: string;
  providers: string[];
  isNewUser: boolean;
  emailVerified: boolean;
}

// Middleware para validação do request
const validateAuthRequest = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (!req.body.email || !req.body.idToken) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Email and token are required",
        code: "MISSING_FIELDS"
      }
    });
  }

  if (typeof req.body.email !== 'string' || !req.body.email.includes('@')) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Invalid email format",
        code: "INVALID_EMAIL"
      }
    });
  }

  next();
};

router.post("/signin", validateAuthRequest, async (req, res) => {
  const { email, idToken } = req.body;

  try {
    const decodedToken = await auth.verifyIdToken(idToken);

    // Verifica se o email do token corresponde ao email enviado
    if (decodedToken.email?.toLowerCase() !== email.toLowerCase()) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Email não corresponde ao token",
          code: "EMAIL_MISMATCH"
        }
      });
    }

    // Tenta encontrar o usuário
    try {
      const user = await auth.getUser(decodedToken.uid);
      const userData = {
        uid: user.uid,
        email: user.email || '',
        providers: user.providerData.map(p => p.providerId),
        isNewUser: false,
        emailVerified: user.emailVerified || false
      };

      return res.status(200).json({
        success: true,
        data: userData
      });

    } catch (error: any) {
      // Caso específico para usuário não encontrado
      if (error.code === "auth/user-not-found") {
        return res.status(404).json({
          success: false,
          error: {
            message: "Email não encontrado, por favor crie uma conta",
            code: "USER_NOT_FOUND"
          }
        });
      }
      throw error;
    }

  } catch (error: any) {
    console.error("Erro no login:", error);
    return res.status(500).json({
      success: false,
      error: {
        message: error.message || "Erro interno no servidor",
        code: error.code || "INTERNAL_ERROR"
      }
    });
  }
});


// Middleware para tratamento de erros
const errorHandler = (
  error: Error & { code?: string },
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.error('API Error:', error);

  const response: ApiResponse = {
    success: false,
    error: {
      message: error.message || 'Internal server error',
      code: error.code || 'INTERNAL_ERROR'
    }
  };

  if (error.code === 'auth/id-token-expired') {
    response.error!.details = 'Token expired, please login again';
    return res.status(401).json(response);
  }

  if (error.code === 'auth/argument-error') {
    response.error!.details = 'Invalid authentication token';
    return res.status(400).json(response);
  }

  res.status(500).json(response);
};

// Rota principal de autenticação
router.post("/signup", validateAuthRequest, async (req, res, next) => {
  const { email, idToken } = req.body;

  try {
    // Verifica o token do Firebase
    const decodedToken = await auth.verifyIdToken(idToken);

    // Valida correspondência de email
    if (decodedToken.email?.toLowerCase() !== email.toLowerCase()) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Email does not match token",
          code: "EMAIL_MISMATCH"
        }
      });
    }

    // Tenta obter o usuário existente
    try {
      const user = await auth.getUser(decodedToken.uid);
      const userData = await formatUserResponse(user, false);

      return res.status(200).json({
        success: true,
        data: userData
      });

    } catch (error: any) {
      // Se usuário não existe, cria um novo
      if (error.code === "auth/user-not-found") {
        const newUser = await auth.createUser({
          uid: decodedToken.uid,
          email: decodedToken.email,
          emailVerified: decodedToken.email_verified || false,
        });

        const userData = await formatUserResponse(newUser, true);

        return res.status(201).json({
          success: true,
          data: userData
        });
      }
      throw error;
    }

  } catch (error) {
    next(error);
  }
});

// Rota para verificação de token
router.post("/verify-token", async (req, res, next) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Authentication token is required",
        code: "TOKEN_REQUIRED"
      }
    });
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const user = await auth.getUser(decodedToken.uid);

    const userData = await formatUserResponse(user, false);

    return res.status(200).json({
      success: true,
      data: {
        ...userData,
        tokenExpiration: new Date(decodedToken.exp * 1000).toISOString()
      }
    });

  } catch (error) {
    next(error);
  }
});

// Helper para formatar resposta do usuário
async function formatUserResponse(user: UserRecord, isNewUser: boolean): Promise<UserAuthData> {
  const providers = user.providerData.map(p => p.providerId);
  
  return {
    uid: user.uid,
    email: user.email || '',
    providers,
    isNewUser,
    emailVerified: user.emailVerified || false
  };
}

// Aplica o middleware de erro
router.use(errorHandler);

export default router;
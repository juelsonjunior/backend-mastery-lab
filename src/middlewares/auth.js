import jwt from "jsonwebtoken";
import { isTokenBlackListed } from "../utils/tokenBlacklist.js";
import { userRepository } from "../container.js";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token não fornecido" });

  if (await isTokenBlackListed(token))
    return res
      .status(401)
      .json({ message: "Token revogado. Faça login novamente!" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userRepository.findById(decoded.userId);

    if (!user || !user.active) {
      return res
        .status(403)
        .json({ message: "Conta inexistente ou desativada pelo administrador." });
    }

    req.user = decoded;
    next();
  } catch (err) {
    res
      .status(403)
      .json({ message: "Token inválido ou expirado", error: err.message });
  }
};

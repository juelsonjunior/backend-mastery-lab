import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens.js";
import { blackListToken } from "../utils/tokenBlacklist.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import AppError from "../errors/AppError.js";

export default class AuthService {
  constructor(userRepository, refreshTokenRepository) {
    this.userRepository = userRepository;
    this.refreshTokenRepository = refreshTokenRepository;
  }

  async login({ email, password, userAgent, ip }) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new AppError("Usuario não encontrado");
    if (user.lockUntil && user.lockUntil > Date.now())
      throw new AppError("Conta bloqueada. Tente mais tarde");

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      const shouldLock = user.failedAttempts + 1 >= 3;

      const updateQuery = shouldLock
        ? {
            $inc: { failedAttempts: 1 },
            $set: { lockUntil: new Date(Date.now() + 5 * 60 * 1000) },
          }
        : {
            $inc: { failedAttempts: 1 },
          };

      await this.userRepository.update(user._id, updateQuery);

      throw new AppError("Verifique suas credencias");
    }

    if (user.failedAttempts > 0 || user.lockUntil) {
      await this.userRepository.update(user._id, {
        failedAttempts: 0,
        lockUntil: null,
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user._id);
    const expireAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const saveRefresh = await this.refreshTokenRepository.create({
      userId: user._id,
      token: refreshToken,
      userAgent,
      ip,
      expireAt,
    });

    if (!saveRefresh) throw new AppError("Falha ao salvar o refresh token");

    return { accessToken, refreshToken };
  }

  async register({ name, email, password }) {
    if (!name || !email || !password)
      throw new AppError("Precisa preencher todos os campos");
    if (password.length < 5)
      throw new AppError("Senha precisa ter no minimo 5 caracteres");

    const userExists = await this.userRepository.findByEmail(email);
    if (userExists) throw new AppError("Este email já esta em uso");

    const newUser = await this.userRepository.create({
      name,
      email,
      password,
    });

    return { message: "Usuário cadastrado com sucesso", newUser };
  }

  async refresh(token) {
    if (!token) throw new AppError("Sem refresh token");

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      throw new AppError("Refresh token inválido ou corrompido");
    }

    const user = await this.userRepository.findById(decoded.userId);

    if (!user) throw new AppError("usuario não encontrado");

    const refreshToken = await this.refreshTokenRepository.findByToken(token);

    if (!refreshToken || new Date() > new Date(refreshToken.expireAt)) {
      throw new AppError("Esse token já esta expirado.");
    }

    const newAccessToken = generateAccessToken(user);

    return newAccessToken;
  }

  async logout(token, refreshToken) {
    if (token) {
      blackListToken(token);
    }

    if (!refreshToken) throw new AppError("Nenhum token foi encontrado");

    const deleted = await this.refreshTokenRepository.delete(refreshToken);

    if (!deleted) {
      throw new AppError("Falha ao excluir o refresh token");
    }

    return { message: "Logout feito com sucesso" };
  }
}

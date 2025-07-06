import bcrypt from "bcrypt";
import { blackListToken } from "../utils/tokenBlacklist.js";
import AppError from "../errors/AppError.js";

export default class UserService {
  constructor(userRepository, refreshTokenRepository) {
    this.userRepository = userRepository;
    this.refreshTokenRepository = refreshTokenRepository
  }

  async profile(userId, { name, email }) {
    if (!userId) throw new AppError("ID do usuário autenticado não fornecido");
    if (!name) throw new AppError("Precisa preencher o campo nome");
    if (!email) throw new AppError("Precisa preencher o campo email");

    const user = await this.userRepository.findById(userId);
    if (!user) throw new AppError("usuáro não encontrado");

    const userEmailExists = await this.userRepository.findByEmail(email);
    if (userEmailExists && userEmailExists._id.toString() !== userId.toString())
      throw new AppError("Este email já está em uso por outro usuário");

    const updateduser = await this.userRepository.update(userId, {
      name,
      email,
    });

    return { message: "Usuario atualizado", data: updateduser };
  }

  async updatedPassword(token, { userId, oldPassword, newPassword }) {
    if (token) {
      blackListToken(token);
    }

    if (!oldPassword || !newPassword)
      throw new AppError("Precisa preencher todos os campos");
    if (newPassword.length < 5)
      throw new AppError("Senha precisa ter no minimo 5 caracteres");

    const user = await this.userRepository.findById(userId);
    if (!user) throw new AppError("usuáro não encontrado");

    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordCorrect)
      throw new AppError("A senha atual esta errada. Tente novamente!");
    if (newPassword == oldPassword)
      throw new AppError("A nova senha não pode ser igual a antiga");

    const hashPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(user._id, { password: hashPassword });

    return { message: "Senha atualizada com sucesso. Faça login novamente" };
  }

  async deleteAccount({ id, password }) {
    if (!password) throw new AppError("Precisa preencher o campo senha");

    const user = await this.userRepository.findById(id);
    if (!user) throw new AppError("Nenhum usuario encontrado");

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      throw new AppError("Senha errada. Digite a senha correta");

    const deleted = await this.userRepository.delete(id);
    if (!deleted) throw new AppError("Falha ao eliminar a conta");

    await this.refreshTokenRepository.deleteByUserId(user._id);

    return { message: "Conta eliminada com sucesso" };
  }

  async listRefreshTokens(userId) {
    if (!userId) throw new AppError("ID do usuário autenticado não fornecido");

    const user = await this.userRepository.findById(userId);
    if (!user) throw new AppError("usuáro não encontrado");

    const listTokens = await this.refreshTokenRepository.findTokenByIdUser(userId);

    if (!listTokens || listTokens.length == 0)
      throw new AppError("Nenhum token encontrado");

    return { message: "Seus tokens de refresh", data: listTokens };
  }
}

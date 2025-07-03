import userRepository from "../repository/userRepository.js";
import bcrypt from "bcrypt";
import refreshTokenRepository from "../repository/refreshTokenRepository.js";
import { blackListToken } from "../utils/tokenBlacklist.js";

const userService = {
  async profile(userId, { name, email }) {
    if (!userId) throw new Error("ID do usuário autenticado não fornecido");

    if (!name) throw new Error("Precisa preencher o campo nome");

    if (!email) throw new Error("Precisa preencher o campo email");

    const user = await userRepository.findById(userId);
    if (!user) throw new Error("usuáro não encontrado");

    const userEmailExists = await userRepository.findByEmail(email);
    if (userEmailExists && userEmailExists._id.toString() !== userId.toString())
      throw new Error("Este email já está em uso por outro usuário");

    const updateduser = await userRepository.update(userId, { name, email });

    return { message: "Usuario atualizado", data: updateduser };
  },

  async updatedPassword(token, { userId, oldPassword, newPassword }) {
    if (token) {
      blackListToken(token);
    }

    if (!oldPassword || !newPassword)
      throw new Error("Precisa preencher todos os campos");

    if (newPassword.length < 5)
      throw new Error("Senha precisa ter no minimo 5 caracteres");

    const user = await userRepository.findById(userId);
    if (!user) throw new Error("usuáro não encontrado");

    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordCorrect)
      throw new Error("A senha atual esta errada. Tente novamente!");

    if (newPassword == oldPassword)
      throw new Error("A nova senha não pode ser igual a antiga");

    const hashPassword = await bcrypt.hash(newPassword, 10);
    await userRepository.update(user._id, { password: hashPassword });

    return { message: "Senha atualizada com sucesso" };
  },

  async deleteAccount({ id, password }) {
    if (!password) throw new Error("Precisa preencher o campo senha");

    const user = await userRepository.findById(id);
    if (!user) throw new Error("Nenhum usuario encontrado");

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      throw new Error("Senha errada. Digite a senha correta");

    const deleted = await userRepository.delete(id);
    if (!deleted) throw new Error("Falha ao eliminar a conta");

    await refreshTokenRepository.deleteByUserId(user._id);

    return { message: "Conta eliminada com sucesso" };
  },

  async listRefreshTokens(userId) {
    if (!userId) throw new Error("ID do usuário autenticado não fornecido");

    const user = await userRepository.findById(userId);
    if (!user) throw new Error("usuáro não encontrado");

    const listTokens = await refreshTokenRepository.findTokenByIdUser(userId);

    if (!listTokens || listTokens.length == 0)
      throw new Error("Nenhum token encontrado");

    return { message: "Seus tokens de refresh", data: listTokens };
  },
};

export default userService;

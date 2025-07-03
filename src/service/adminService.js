import userRepository from "../repository/userRepository.js";
import refreshTokenRepository from "../repository/refreshTokenRepository.js";
import { blackListToken } from "../utils/tokenBlacklist.js";

const adminService = {
  async disabledUser(userId, { active }, reqUserId) {
    if (!userId) throw new Error("Precisa informar um id válido");

    if (!reqUserId) throw new Error("ID do usuário autenticado não fornecido");

    if (active !== true && active !== false)
      throw new Error("O campo active é obrigatório e deve ser true ou false");

    const user = await userRepository.findById(userId);

    if (!user) {
      throw new Error("Nenhum usuário foi encontrado");
    }

    if (user._id.toString() == reqUserId.toString())
      throw new Error("Você não pode desativar tua propria conta");

    if (user.role == "admin" || user.role == "mod")
      throw new Error(
        "Não é permitido desativar usuários com privilégios elevados"
      );

    const disabledUser = await userRepository.update(user._id, { active });

    const tokenUserDisabled = await refreshTokenRepository.findTokenByIdUser(
      disabledUser._id
    );

    if (tokenUserDisabled && tokenUserDisabled.length > 0) {
      tokenUserDisabled.forEach(({ token }) => blackListToken(token));
    }

    return {
      message: `Usuario ${active ? "Activado" : "Desativado"} com sucesso`,
    };
  },
};

export default adminService;

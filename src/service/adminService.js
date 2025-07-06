import { blackListToken } from "../utils/tokenBlacklist.js";
import AppError from "../errors/AppError.js";

export default class AdminService {
  constructor(userRepository, refreshTokenRepository) {
    this.userRepository = userRepository;
    this.refreshTokenRepository = refreshTokenRepository;
  }
  
  async disabledUser(userId, { active }, reqUserId) {
    if (!userId) throw new AppError("Precisa informar um id válido");
    if (!reqUserId)
      throw new AppError("ID do usuário autenticado não fornecido");

    if (active !== true && active !== false)
      throw new AppError(
        "O campo active é obrigatório e deve ser true ou false"
      );

    const user = await this.userRepository.findById(userId);
    if (!user) throw new AppError("Nenhum usuário foi encontrado");

    if (user._id.toString() == reqUserId.toString())
      throw new AppError("Você não pode desativar tua propria conta");

    if (user.role == "admin" || user.role == "mod")
      throw new AppError(
        "Não é permitido desativar usuários com privilégios elevados"
      );

    const disabledUser = await this.userRepository.update(user._id, { active });

    const tokenUserDisabled =
      await this.refreshTokenRepository.findTokenByIdUser(disabledUser._id);

    if (tokenUserDisabled && tokenUserDisabled.length > 0) {
      tokenUserDisabled.forEach(({ token }) => blackListToken(token));
    }

    return {
      message: `Usuario ${active ? "Activado" : "Desativado"} com sucesso`,
    };
  }
}

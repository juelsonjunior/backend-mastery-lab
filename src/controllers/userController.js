import BaseController from "./baseController.js";

export default class UserController extends BaseController {
  constructor(userService) {
    super();
    this.userService = userService;

    this.home = this.home.bind(this);
    
    this.profile = this.handlerRequest(
      this.profileHandler.bind(this)
    );
    this.updatedPassword = this.handlerRequest(
      this.updatedPasswordHandler.bind(this)
    );
    this.deleteAccount = this.handlerRequest(
      this.deleteAccountHandler.bind(this)
    );
    this.listRefreshTokens = this.handlerRequest(
      this.listRefreshTokensHandler.bind(this)
    );
  }

  async home(req, res) {
    res.status(200).json({
      message: `Acesso autorizado a Home. Usuário ID: ${req.user.userId}`,
    });
  }

  async profileHandler(req) {
    return this.userService.profile(req.user.userId, req.body);
  }

  async updatedPasswordHandler(req) {
    const token = req.headers.authorization.split(" ")[1];

    return this.userService.updatedPassword(token, {
      userId: req.user.userId,
      oldPassword: req.body.oldPassword,
      newPassword: req.body.newPassword,
    });
  }

  async deleteAccountHandler(req, res) {
    const result = await this.userService.deleteAccount({
      id: req.user.userId,
      password: req.body.password,
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });
    return result;
  }

  async listRefreshTokensHandler(req) {
    return this.userService.listRefreshTokens(req.user.userId);
  }
}

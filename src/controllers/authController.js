import BaseController from "./baseController.js";

export default class AuthController extends BaseController {
  constructor(authService) {
    super();
    this.authService = authService;
    this.login = this.handlerRequest(this.loginHandler.bind(this));
    this.register = this.handlerRequest(this.registerHandler.bind(this));
    this.refresh = this.handlerRequest(this.refreshHandler.bind(this));
    this.logout = this.handlerRequest(this.logoutHandler.bind(this));
  }

  async loginHandler(req, res) {
    const { refreshToken, accessToken } = await this.authService.login({
      email: req.body.email,
      password: req.body.password,
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return accessToken;
  }

  async registerHandler(req, res) {
    return await this.authService.register(req.body);
  }

  async refreshHandler(req, res) {
    return await this.authService.refresh(req.cookies.refreshToken);
  }

  async logoutHandler(req, res) {
    const token = req.headers.authorization.split(" ")[1];

    const result = await this.authService.logout(
      token,
      req.cookies.refreshToken
    );
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });
    return result;
  }
}

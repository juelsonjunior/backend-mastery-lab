import authService from "../service/authService.js";

const authController = {
  async login(req, res) {
    try {
      const { refreshToken, accessToken } = await authService.login({
        email: req.body.email,
        password: req.body.password,
        userAgent: req.headers["user-agent"],
        ip: req.ip,
      });
      res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "Strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json({ accessToken });
    } catch (err) {
      res.status(500).json({ message: "Erro interno", error: err.message });
    }
  },

  async register(req, res) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ message: "Erro interno", error: err.message });
    }
  },

  async refresh(req, res) {
    try {
      const result = await authService.refresh(req.cookies.refreshToken);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Erro interno", error: err.message });
    }
  },

  async logout(req, res) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const result = await authService.logout(token, req.cookies.refreshToken);
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      });
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Erro interno", error: err.message });
    }
  },
};

export default authController;

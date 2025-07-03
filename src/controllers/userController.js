import userService from "../service/userService.js";

const userController = {
  async profile(req, res) {
    try {
      const result = await userService.profile(req.user.userId, req.body);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Erro interno", error: err.message });
    }
  },

  async updatedPassword(req, res) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const result = await userService.updatedPassword(token, {
        userId: req.user.userId,
        oldPassword: req.body.oldPassword,
        newPassword: req.body.newPassword,
      });
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Erro interno", error: err.message });
    }
  },

  async deleteAccount(req, res) {
    try {
      const result = await userService.deleteAccount({
        id: req.user.userId,
        password: req.body.password,
      });
      res
        .clearCookie("refreshToken", {
          httpOnly: true,
          secure: true,
          sameSite: "Strict",
        })
        .status(200)
        .json(result);
    } catch (err) {
      res.status(500).json({ message: "Erro interno", error: err.message });
    }
  },

  async Home(req, res) {
    res.status(200).json({
      message: `Acesso autorizado a Home. Usuário ID: ${req.user.userId}`,
    });
  },

  async listRefreshTokens(req, res) {
    try {
      const result = await userService.listRefreshTokens(req.user.userId);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Erro interno", error: err.message });
    }
  },
};

export default userController;

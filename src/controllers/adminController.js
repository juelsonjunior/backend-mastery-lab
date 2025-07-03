import adminService from "../service/adminService.js";

const adminController = {
  async disabledUser(req, res) {
    try {
      const result = await adminService.disabledUser(req.params.id, req.body, req.user.userId);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Erro interno", error: err.message });
    }
  },

  async dashBoardAdmin(req, res) {
    res.status(200).json({
      message: `Acesso autorizado. Bem-vindo usuário admin`,
      data: req.user,
    });
  },
};

export default adminController;

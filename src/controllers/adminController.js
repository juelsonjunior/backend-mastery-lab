import BaseController from "./baseController.js";

export default class AdminController extends BaseController {
  constructor(adminService) {
    super()
    this.adminService = adminService;

    this.disabledUser = this.handlerRequest(
      this.disabledUserHanlder.bind(this)
    );
    this.homeAdmin = this.homeAdmin.bind(this);
  }
  
  async homeAdmin(req, res) {
    res.status(200).json({
      message: `Acesso autorizado. Bem-vindo usuário admin`,
      data: req.user,
    });
  }

  async disabledUserHanlder(req) {
    return await this.adminService.disabledUser(
      req.params.id,
      req.body,
      req.user.userId
    );
  }

}

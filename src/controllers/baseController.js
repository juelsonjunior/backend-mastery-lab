export default class BaseController {
  handlerRequest(serverMethod) {
    return async (req, res) => {
      try {
        const result = await serverMethod(req, res);
        res.status(200).json(result);
      } catch (err) {
        console.log("[ERRO NO CONTROLLER]", {
          statusCode: err.statusCode,
          clientMessage: err.clientMessage,
          message: err.message,
          stack: err.stack,
        });

        res.status(err.statusCode || 500).json({
          message: err.clientMessage || "Erro interno do servidor",
          error:
            process.env.NODE_DEV === "development" ? err.message : undefined,
        });
      }
    };
  }
}

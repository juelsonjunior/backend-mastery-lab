export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    const { role } = req.user;
    if (!allowedRoles.includes(role)) {
      return res
        .status(403)
        .json({
          message: `Acesso negado: necessário papel ${allowedRoles.join(
            " ou "
          )}`,
        });
    }
    next();
  };
};

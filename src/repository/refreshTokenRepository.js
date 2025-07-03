import refreshTokenModel from "../models/RefreshToken.js";

const refreshTokenRepository = {
  async create(tokenData) {
    return await refreshTokenModel.create(tokenData);
  },

  async findTokenByIdUser(userId) {
    return await refreshTokenModel.find({ userId });
  },

  async findByToken(token) {
    return await refreshTokenModel.findOne({ token });
  },

  async delete(refreshToken) {
    return await refreshTokenModel.deleteOne({ token: refreshToken });
  },

  async deleteByUserId(userId) {
    return await refreshTokenModel.deleteMany({ userId });
  },
};

export default refreshTokenRepository;

export default class RefreshTokenRepository {
  constructor(refreshTokenModel) {
    this.refreshTokenModel = refreshTokenModel;
  }
  
  async create(tokenData) {
    return await this.refreshTokenModel.create(tokenData);
  }

  async findTokenByIdUser(userId) {
    return await this.refreshTokenModel.find({ userId });
  }

  async findByToken(token) {
    return await this.refreshTokenModel.findOne({ token });
  }

  async delete(refreshToken) {
    return await this.refreshTokenModel.deleteOne({ token: refreshToken });
  }

  async deleteByUserId(userId) {
    return await this.refreshTokenModel.deleteMany({ userId });
  }
}

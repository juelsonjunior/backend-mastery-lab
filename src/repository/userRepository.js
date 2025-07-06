export default class UserRepository {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async create(userData) {
    return await this.userModel.create(userData);
  }

  async findByEmail(email) {
    return await this.userModel.findOne({ email });
  }

  async findById(id) {
    return await this.userModel.findOne({ _id: id });
  }

  async update(id, userData) {
    return await this.userModel
      .findByIdAndUpdate(id, userData, {
        new: true,
      })
      .select("-password");
  }

  async delete(id) {
    return await this.userModel.findByIdAndDelete({ _id: id });
  }
}

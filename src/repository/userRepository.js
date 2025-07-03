import UserModel from "../models/User.js";

const userRepository = {
  async create(userData) {
    return await UserModel.create(userData).select("-password");
  },

  async findByEmail(email) {
    return await UserModel.findOne({ email });
  },

  async findById(id) {
    return await UserModel.findOne({ _id: id });
  },

  async update(id, userData) {
    return await UserModel.findByIdAndUpdate(id, userData, {
      new: true,
    }).select("-password");
  },

  async delete(id) {
    return await UserModel.findByIdAndDelete({ _id: id });
  },
};

export default userRepository;

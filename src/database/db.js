import mongoose from "mongoose";

const connectDb = async () => {
  return await mongoose.connect(process.env.MONGO_URI);
};

export default connectDb;

import RefreshTokenRepository from "./repository/refreshTokenRepository.js";
import UserRepository from "./repository/userRepository.js";

import AdminController from "./controllers/adminController.js";
import AuthController from "./controllers/authController.js";
import UserController from "./controllers/userController.js";

import AdminService from "./service/adminService.js";
import AuthService from "./service/authService.js";
import UserService from "./service/userService.js";

import UserModel from "./models/User.js";
import RefreshTokenModel from "./models/RefreshToken.js";

const userRepository = new UserRepository(UserModel);
const refreshTokenRepository = new RefreshTokenRepository(RefreshTokenModel);

const adminService = new AdminService(userRepository, refreshTokenRepository)
const authService = new AuthService(userRepository, refreshTokenRepository);
const userService = new UserService(userRepository, refreshTokenRepository);

const adminController = new AdminController(adminService);
const authController = new AuthController(authService);
const userController = new UserController(userService);

export { userController, authController, adminController, userRepository };

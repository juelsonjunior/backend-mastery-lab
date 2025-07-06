export default class AppError extends Error {
  constructor(clientMessage, statuscode = 400) {
    super(clientMessage);
    this.clientMessage = clientMessage;
    this.statuscode = statuscode;

    Error.captureStackTrace(this, this.constructor);
  }
}

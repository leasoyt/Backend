import { HttpException } from "@nestjs/common";

export class CustomHttpException {

    public throw = {};
    public exception;
    public message: string;
    public error: any;

    /**
     * 
     * @param message Mensaje generico de error, string o tipo HttpMessagesEnum, puede ser nulo para enviar el mensaje de TryCatchWrapper
     * @param exception 
     * @param error Error desconocido atrapado en catch()
     */
    constructor(message: string | null, exception: new (...args: any[]) => HttpException = HttpException, error?: any) {
        this.exception = exception;
        this.message = message;
        this.error = error;
        this.throw = { message: message, exception: exception, error: error };
    }
}
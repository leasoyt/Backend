import { HttpException } from "@nestjs/common";
import { HttpMessagesEnum } from "src/enums/httpMessages.enum";

/**
 * @param message Mensaje customizado, ejemplo: `CustomMessagesEnum.LOGIN_FAIL`
 * @param status tipo `HttpStatus`, ejemplo: `HttpStatus.ACCEPTED`
 * @param exception clase de la exception, ejemplo `NotFoundException`
 * @returns 
 */
export function HandleError(message: HttpMessagesEnum, exception: new (...args: any[]) => HttpException = HttpException) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

        const method = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            try {
                return await method.apply(this, args)
            } catch (err) {
                // if (exception === NotFoundException) {
                //     throw new NotFoundException({ message: message, error: err?.message || err });
                // }
                throw new exception({ message: message, error: err?.message || err });
            }
        }
    }
}
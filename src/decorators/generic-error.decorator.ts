import { HttpException } from "@nestjs/common";
import { HttpMessagesEnum } from "src/enums/httpMessages.enum";

/**
 * @param message Mensaje customizado, ejemplo: `CustomMessagesEnum.LOGIN_FAIL`
 * @param exception clase de la exception, ejemplo `NotFoundException`
 * @returns 
 */
export function TryCatchWrapper(message: HttpMessagesEnum, exception: new (...args: any[]) => HttpException = HttpException) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

        const method = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            try {
                return await method.apply(this, args)
            } catch (err) {

                if (err.exception) {
                    throw new err.exception({message: message, error: err?.error || err});
                }

                throw new exception({ message: message, error: err?.error || err });
            }
        }
    }
}
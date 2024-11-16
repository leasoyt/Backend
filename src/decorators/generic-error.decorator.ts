import { HttpException } from "@nestjs/common";
import { HttpMessagesEnum } from "src/enums/httpMessages.enum";
import { CustomHttpException } from "src/helpers/custom-error-class";

/**
 * @param message Mensaje customizado, ejemplo: `CustomMessagesEnum.LOGIN_FAIL`
 * @param exception clase de la exception, ejemplo `NotFoundException`
 * @returns 
 */
export function TryCatchWrapper(message: HttpMessagesEnum | null, exception: new (...args: any[]) => HttpException = HttpException) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

        const method = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            try {
                return await method.apply(this, args)
            } catch (err) {

                if (err instanceof CustomHttpException) {
                    if (err.message === null || err.message === undefined) {
                        throw new err.exception({ message: message, error: err?.error || err?.message });

                    }

                    throw new err.exception({ message: err.message, error: err?.error || err?.message });
                }

                throw new exception({ message: message, error: err?.error || err?.message });
            }
        }
    }
}
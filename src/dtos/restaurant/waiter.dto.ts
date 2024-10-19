import { RegisterEmployeeDto } from "../staff/register-employee.dto";

export class Waiter extends RegisterEmployeeDto {
    constructor() {
        super();
        this.rol = 'waiter'
    }
}
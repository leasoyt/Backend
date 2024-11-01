import { OmitType } from '@nestjs/swagger';
import { SanitizedUserDto } from './sanitized-user.dto';
import { User } from 'src/entities/user.entity';

export class UserProfileDto extends OmitType(SanitizedUserDto, ['id', 'role']) {
  id: string;
  name: string;
  email: string;
  // Agrega otros campos según sea necesario

  constructor(user: User) {
    super(); // Llamada a 'super' obligatoria para clases derivadas
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    // Asigna otros campos necesarios
  }
}

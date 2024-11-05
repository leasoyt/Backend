// import { Controller, Request, Sse} from '@nestjs/common';
// import { Observable } from 'rxjs';
// // import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { NotificationsService } from './notifications.service';

// // Importa o define SseEvent en este archivo si es necesario
// interface SseEvent {
//   data: string;
// }

// @Controller('events')
// export class NotificationsController {
//   constructor(private readonly notificationsService: NotificationsService) {}

//   // @UseGuards(AdminGuard, AuthGuard)
//   // @Roles(UserRole.ADMIN)
//   // @UseGuards(ServerSideEventsGuard)
//   @Sse('notifications')
//   sendNotifications(@Request() req): Observable<SseEvent> {
//     return this.notificationsService.getNotifications();
//   }
// }

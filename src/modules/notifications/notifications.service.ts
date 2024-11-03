import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';

// Define un tipo de evento simplificado
interface SseEvent {
  data: string;
}

@Injectable()
export class NotificationsService {
  private notificationSubject = new Subject<SseEvent>();

  // Método para obtener el observable que usará SSE
  getNotifications(): Observable<SseEvent> {
    return this.notificationSubject.asObservable();
  }

  // Método para enviar una notificación
  sendNotification(message: string) {
    const event: SseEvent = {
      data: message,
    };
    this.notificationSubject.next(event); // Emite el evento simplificado
  }
}

import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AdoptionRequestService } from 'src/adoptionRequest/adoption-request.service';
import { NotificationsService } from 'src/notifications/notifications.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AdoptionRequestGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private readonly adoptionRequestService: AdoptionRequestService,
    private readonly notificationService: NotificationsService,
  ) {}

  // Manejar conexión de cliente
  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId;
    if (userId) {
      client.join(`user_${userId}`);
    } else {
      console.warn(
        `Connection rejected: No userId provided for socket ID: ${client.id}`,
      );
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Enviar una notificación de nueva solicitud a los clientes conectados
  async notifyNewRequest(requestId: number) {
    const adoptionRequest =
      await this.adoptionRequestService.findOne(requestId);
    const ownerId = adoptionRequest.pet.ownerId;
    const ownerNotificationToken = adoptionRequest.pet.owner.notificationToken;
    const petName = adoptionRequest.pet.name;

    const requester = adoptionRequest.user;
    const requesterName = requester.name;
    const requesterEmail = requester.email;
    if (ownerId) {
      this.server.to(`user_${ownerId}`).emit('newAdoptionRequest', {
        pet: adoptionRequest.pet,
        requester: {
          name: requesterName,
          email: requesterEmail,
        },
        requestDetails: adoptionRequest,
      });
      if (ownerNotificationToken) {
        await this.notificationService.sendPushNotification(
          ownerNotificationToken,
          'Nueva solicitud de adopción',
          `¡Tu mascota ${petName} tiene una nueva solicitud de adopción!`,
        );
        console.log(`Notificación enviada a user_${ownerId}`);
      } else {
        console.warn(
          `El usuario ${ownerId} no tiene un token de notificación.`,
        );
      }
    }
  }

  // Listener para recibir mensajes del cliente
  @SubscribeMessage('createAdoptionRequest')
  async createRequest(@MessageBody() data: any) {
    const { petId, userId, description } = data;
    const newRequest = await this.adoptionRequestService.create({
      petId,
      userId,
      description,
    });
    this.notifyNewRequest(newRequest.id);
    return newRequest;
  }

  @SubscribeMessage('acceptAdoptionRequest')
  async acceptRequest(
    @MessageBody() data: { requestId: number; accepted: boolean },
  ) {
    const { requestId, accepted } = data;

    const status = accepted ? 'APPROVED' : 'REJECTED';
    const updatedRequest = await this.adoptionRequestService.updateStatus(
      requestId,
      status,
    );
    const adoptionRequest =
      await this.adoptionRequestService.findOne(requestId);
    const petOwnerId = adoptionRequest.pet.ownerId;
    const userNotificationToken = adoptionRequest.user.notificationToken;
    const petName = adoptionRequest.pet.name;

    if (userNotificationToken) {
      await this.notificationService.sendPushNotification(
        userNotificationToken,
        `Solicitud de adopción ${status === 'APPROVED' ? 'aceptada' : 'rechazada'}`,
        `La solicitud para adoptar a ${petName} ha sido ${status === 'APPROVED' ? 'aceptada' : 'rechazada'}.`,
      );
      console.log(`Notificación enviada a user_${adoptionRequest.userId}`);
    }

    if (petOwnerId) {
      this.server
        .to(`user_${petOwnerId}`)
        .emit('adoptionRequestStatus', updatedRequest);
    }

    return updatedRequest;
  }
}

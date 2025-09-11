import { Injectable, Logger } from '@nestjs/common';
import {
  ApiMessageReaction,
  MezonClient,
  Events,
  TokenSentEvent,
  UserChannelRemoved,
  UserChannelAddedEvent,
} from 'mezon-sdk';
import { MezonClientService } from 'src/mezon/client.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BOT_ID } from '../constants/config';

@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name);
  private client: MezonClient;

  constructor(
    private clientService: MezonClientService,
    private eventEmitter: EventEmitter2,
  ) {
    this.client = clientService.getClient();
  }

  initEvent() {
    this.client.onTokenSend((data: TokenSentEvent) => {
      this.eventEmitter.emit(Events.TokenSend, data);
    });

    this.client.onMessageButtonClicked(async (data) => {
      console.log('onMessageButtonClicked', data);
      // const channel = await this.client.channels.fetch(data.channel_id);
      // const messageEmbed = await channel.messages.fetch(data.message_id);
      // await messageEmbed.update({ t: 'hello, updated' });

      this.eventEmitter.emit(Events.MessageButtonClicked, data);
    });

    this.client.onMessageReaction((msg: ApiMessageReaction) => {
      console.log('msg', msg);
      this.eventEmitter.emit(Events.MessageReaction, msg);
    });

    this.client.onUserChannelAdded((user: UserChannelAddedEvent) => {
      this.eventEmitter.emit(Events.UserChannelAdded, user);
    });

    this.client.onUserChannelRemoved((msg: UserChannelRemoved) => {
      this.eventEmitter.emit(Events.UserChannelRemoved, msg);
    });

    this.client.onChannelMessage(async (message) => {
      if (message.sender_id && message.sender_id !== BOT_ID) {
        this.eventEmitter.emit(Events.ChannelMessage, message);
      }
    });
  }
}

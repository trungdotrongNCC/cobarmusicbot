import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Events, ChannelMessage, MezonClient } from 'mezon-sdk';
import { MezonClientService } from 'src/mezon/client.service';

import { messagesBusy } from '../constants/text';
import { BOT_ID } from '../constants/config';
import { CommandBase } from '../base/command.handle';

@Injectable()
export class ChannelMessageEventHandler {
  constructor(private commandBase: CommandBase) {}

  getRandomMessage(): string {
    const randomIndex = Math.floor(Math.random() * messagesBusy.length);
    return messagesBusy[randomIndex];
  }

  @OnEvent(Events.ChannelMessage)
  async handleMessage(message: ChannelMessage) {
    try {
      const content = message.content.t;
      if (typeof content == 'string' && content.trim()) {
        const firstLetter = content.trim()[0];
        switch (firstLetter) {
          case '*':
            await this.commandBase.execute(content, message);
            break;
          default:
            return;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}

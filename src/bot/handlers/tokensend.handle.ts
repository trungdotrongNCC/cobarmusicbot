import { OnEvent } from '@nestjs/event-emitter';
import { Events, TokenSentEvent } from 'mezon-sdk';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChannelMessageEventHandler {

  constructor() {}

  @OnEvent(Events.TokenSend)
  async handleRecharge(tokenEvent: TokenSentEvent) {
    // hanle logic here
    console.log('tokenEvent', tokenEvent)
  }
}

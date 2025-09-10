import { DiscoveryModule } from '@nestjs/core';
import { ChannelMessageEventHandler } from './handlers/channelMessage.handler';
import { BotGateway } from './events/bot.gateway';
import { HelpCommand } from './commands/help/help.command';
import { Module } from '@nestjs/common/decorators/modules';
import { CommandBase } from './base/command.handle';

@Module({
  imports: [DiscoveryModule],
  providers: [BotGateway, ChannelMessageEventHandler, CommandBase, HelpCommand],
  controllers: [],
})
export class BotModule {}

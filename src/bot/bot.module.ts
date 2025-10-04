import { DiscoveryModule } from '@nestjs/core';
import { ChannelMessageEventHandler } from './handlers/channelMessage.handler';
import { BotGateway } from './events/bot.gateway';
import { HelpCommand } from './commands/help/help.command';
import { Module } from '@nestjs/common/decorators/modules';
import { CommandBase } from './base/command.handle';
import { EmbebCommand } from './commands/embed/embed.command';
import { PlayMediaCommand } from './commands/playMedia/playMedia.command';
import { EmbebSecondCommand } from './commands/embed2/embed-second.command';
import { TokenSentEventHandler } from './handlers/tokensend.handle';

@Module({
  imports: [DiscoveryModule],
  providers: [
    BotGateway,
    ChannelMessageEventHandler,
    CommandBase,
    HelpCommand,
    EmbebCommand,
    PlayMediaCommand,
    EmbebSecondCommand,
    TokenSentEventHandler,
  ],
  controllers: [],
})
export class BotModule {}

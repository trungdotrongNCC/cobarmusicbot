import { ChannelMessage, EMarkdownType, MezonClient } from 'mezon-sdk';
import { CommandMessage } from 'src/bot/base/command.abstract';
import { Command } from 'src/bot/base/commandRegister.decorator';
import { CommandStorage } from 'src/bot/base/storage';
import { MezonClientService } from 'src/mezon/client.service';

@Command('playmedia')
export class PlayMediaCommand extends CommandMessage {
  constructor(clientService: MezonClientService) {
    super(clientService);
  }

  async execute(args: string[], message: ChannelMessage) {
    const { currentMessage, channel } = await this.getChannelMessage(message);
    //*playmedia https://cdn.mezon.ai/sounds/7346483973050015537.mp3
    await channel?.playMedia(args[0], 'KOMU', 'KOMU', 'KOMU');
    return 'messageSent';
  }
}

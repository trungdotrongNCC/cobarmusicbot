import { ChannelMessage, EMarkdownType, MezonClient } from 'mezon-sdk';
import { CommandMessage } from 'src/bot/base/command.abstract';
import { Command } from 'src/bot/base/commandRegister.decorator';
import { CommandStorage } from 'src/bot/base/storage';
import { MezonClientService } from 'src/mezon/client.service';

@Command('help')
export class HelpCommand extends CommandMessage {
  constructor(clientService: MezonClientService) {
    super(clientService);
  }

  async execute(args: string[], message: ChannelMessage) {
    const { currentMessage } = await this.getChannelMessage(message);

    const messageContent = 'Help Menu';
    const messageSent = await currentMessage?.reply({
      t: messageContent,
      mk: [{ type: EMarkdownType.PRE, s: 0, e: messageContent.length }],
    });
    return messageSent;
  }
}

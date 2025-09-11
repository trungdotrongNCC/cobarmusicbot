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

  sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async execute(args: string[], message: ChannelMessage) {
    const { currentMessage, channel, clan } =
      await this.getChannelMessage(message);

    const messageContent = `Hello ${message.username}`;

    //reply message
    const messageSent = await currentMessage?.reply({
      t: messageContent,
      mk: [{ type: EMarkdownType.PRE, s: 0, e: messageContent.length }],
    });

    const messageSentChannel = await channel?.messages.fetch(
      messageSent?.message_id ?? '',
    );

    // update message
    await this.sleep(2000);
    const messageUpdatedContent = `[Updated] hello ${message.username}`;
    await messageSentChannel?.update({
      t: messageUpdatedContent,
      mk: [{ type: EMarkdownType.BOLD, s: 0, e: messageUpdatedContent.length }],
    });

    // reaction message
    await this.sleep(2000);
    await messageSentChannel?.react({
      emoji_id: '7237400934936503017',
      emoji: ':pepe_joy:',
      count: 1,
    });

    // sendEphemeral
    await this.sleep(2000);
    const messageEphe = await channel?.sendEphemeral(message.sender_id, {
      t: 'This is a ephemeral message',
    });

    // remove reaction
    await this.sleep(2000);
    await messageSentChannel?.react({
      emoji_id: '7237400934936503017',
      emoji: ':pepe_joy:',
      count: 1,
      action_delete: true,
    });

    // remove message
    await this.sleep(2000);
    await messageSentChannel?.delete();

    const user = await clan?.users?.fetch(message.sender_id);
    await user?.sendDM({ t: 'send DM hello' });
    return messageSent;
  }
}

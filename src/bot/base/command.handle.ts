import { ChannelMessage } from 'mezon-sdk';
import { ModuleRef } from '@nestjs/core';
import { CommandStorage } from '../base/storage';
import { CommandMessage } from './command.abstract';
import { Injectable } from '@nestjs/common/decorators/core';

@Injectable()
export class CommandBase {
  public commandList: { [key: string]: CommandMessage };

  constructor(
    private readonly moduleRef: ModuleRef
  ) {}

  extractMessage(message: string) {
  const args = message.replace('\n', ' ').slice('*'.length).trim().split(/ +/);
  if (args.length > 0) {
    return [args.shift()?.toLowerCase(), args];
  } else return [false, []];
}


  execute(messageContent: string, message: ChannelMessage) {
    const [commandName, args] = this.extractMessage(messageContent);

    const target = CommandStorage.getCommand(commandName as string);
    if (target) {
      const command = this.moduleRef.get(target);

      if (command) {
        return command.execute(args, message);
      }
    }
  }
}

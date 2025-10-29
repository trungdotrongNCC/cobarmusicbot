import { DynamicModule, Global, Module } from '@nestjs/common';
import { MezonModuleAsyncOptions } from './types/MezonModuleAsyncOptions';
import { MezonClientService } from './client.service';
import { ConfigService } from '@nestjs/config';
import { MezonClientConfig } from './types/config';

@Global()
@Module({})
export class MezonModule {
  static forRootAsync(options: MezonModuleAsyncOptions): DynamicModule {
    return {
      module: MezonModule,
      imports: options.imports,
      providers: [
        {
          provide: MezonClientService,
          useFactory: async (configService: ConfigService) => {
            const clientConfig: MezonClientConfig = {
              token: configService.get<string>('MEZON_TOKEN') ?? '',
              bot_id: process.env.BOT_ID,
            };

            const client = new MezonClientService(clientConfig);

            await client.initializeClient();

            return client;
          },
          inject: [ConfigService],
        },
      ],
      exports: [MezonClientService],
    };
  }
}

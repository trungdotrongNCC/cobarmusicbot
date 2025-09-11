import {
  ChannelMessage,
  EButtonMessageStyle,
  EMarkdownType,
  EMessageComponentType,
  MezonClient,
} from 'mezon-sdk';
import { CommandMessage } from 'src/bot/base/command.abstract';
import { Command } from 'src/bot/base/commandRegister.decorator';
import { EmbedProps } from 'src/bot/constants/config';
import { MezonClientService } from 'src/mezon/client.service';
import { getRandomColor, MEZON_EMBED_FOOTER } from 'src/utils/helper';

const slotItems = [
  '1.png',
  '2.png',
  '3.png',
  '4.png',
  '5.png',
  '6.png',
  '7.png',
  '8.png',
  '9.png',
  '10.png',
  '11.png',
  '12.png',
  '13.png',
  '14.png',
  '15.png',
];

@Command('embed')
export class EmbebCommand extends CommandMessage {
  constructor(clientService: MezonClientService) {
    super(clientService);
  }

  sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async execute(args: string[], message: ChannelMessage) {
    const { currentMessage, channel } = await this.getChannelMessage(message);

    const results = [
      [...slotItems, '1.png'],
      [...slotItems, '1.png'],
      [...slotItems, '1.png'],
    ];

    // embed show information
    const embedInfomations: EmbedProps[] = [
      {
        color: getRandomColor(),
        title: `${message.clan_nick || message.username}'s infomation`,
        author: {
          name: (message.clan_nick || message.username) ?? '',
          icon_url: message.avatar,
          url: message.avatar,
        },
        description: 'description',
        thumbnail: {
          url: message.avatar ?? '',
        },
        fields: [
          {
            name: `• Username`,
            value: `${message.username}`,
          },
          {
            name: `• Phone`,
            value: ` 0335010373`,
          },
          {
            name: '',
            value: '',
            inputs: {
              id: `slots`,
              type: EMessageComponentType.ANIMATION,
              component: {
                url_image:
                  'https://cdn.mezon.ai/0/1834156727516270592/1805415525119955000/1751356942745_1slots.png',
                url_position:
                  'https://cdn.mezon.ai/0/1834156727516270592/1827994776956309500/1751357108975_slots.json',
                pool: results,
                repeat: 3,
                duration: 0.5,
              },
            },
          },
        ],
        image: { url: message.avatar!, width: '400px', height: '400px' },
        timestamp: new Date().toISOString(),
        footer: MEZON_EMBED_FOOTER,
      },
    ];

    // embed show form
    const embedForm: EmbedProps[] = [
      {
        color: getRandomColor(),
        title: `Embed form`,
        fields: [
          {
            name: 'Project:',
            value: '',
            inputs: {
              id: `form-project`,
              type: EMessageComponentType.SELECT,
              component: {
                options: [
                  {
                    label: 'Project 1',
                    value: 'project_1',
                  },
                  {
                    label: 'Project 2',
                    value: 'project_2',
                  },
                ],
                required: true,
                valueSelected: null,
              },
            },
          },
          {
            name: 'Task',
            value: '',
            inputs: {
              id: `form-task`,
              type: EMessageComponentType.INPUT,
              component: {
                id: `form-component-task`,
                placeholder: 'Ex. Write something',
                defaultValue: '',
              },
            },
          },
          {
            name: 'Description',
            value: '',
            inputs: {
              id: `form-description`,
              type: EMessageComponentType.INPUT,
              component: {
                id: `form-description-component`,
                placeholder: 'Ex. Write something',
                textarea: true,
                defaultValue: 'Default task description',
              },
            },
          },
          {
            name: 'Working time',
            value: '',
            inputs: {
              id: `form-working-time`,
              type: EMessageComponentType.INPUT,
              component: {
                id: `form-working-time-component`,
                placeholder: 'Ex. Enter Workingtime',
                defaultValue: 8,
                type: 'number',
              },
            },
          },
          {
            name: 'Radio Component',
            value: '',
            inputs: {
              id: `form-radio`,
              type: EMessageComponentType.RADIO,
              component: [
                {
                  label: 'Mezon is the best',
                  value: 'the_best',
                  description: 'Mezon is the best - description',
                  style: EButtonMessageStyle.PRIMARY,
                },
                {
                  label: 'Mezon is number one',
                  value: 'number_one',
                  description: 'Mezon is number one - description',
                  style: EButtonMessageStyle.SUCCESS,
                },
              ],
              maxmax_options: 2,
            },
          },
          {
            name: 'Bạn có chắc chắn muốn unlock timesheet?\nTiền phạt sẽ không được hoàn trả!',
            value: '',
          },
        ],

        timestamp: new Date().toISOString(),
        footer: MEZON_EMBED_FOOTER,
      },
    ];

    // component button
    const components = [
      {
        id: `form_CANCEL_${message.sender_id}`,
        type: EMessageComponentType.BUTTON,
        component: {
          label: `Cancel`,
          style: EButtonMessageStyle.SECONDARY,
        },
      },
      {
        id: `form_CONFIRM_${message.sender_id}`,
        type: EMessageComponentType.BUTTON,
        component: {
          label: `Vote`,
          style: EButtonMessageStyle.SUCCESS,
        },
      },
      {
        id: `form_DELETE_${message.sender_id}`,
        type: EMessageComponentType.BUTTON,
        component: {
          label: `Delete`,
          style: EButtonMessageStyle.DANGER,
        },
      },
    ];

    const messageContent = `Hello ${message.username}`;

    // await channel?.sendEphemeral(message.sender_id, {
    //   embed: embedForm,
    //   components: [{ components }],
    // });

    const messageSent = await currentMessage?.reply({
      t: messageContent,
      embed: embedForm,
      components: [{ components }],
    });

    return 'messageSent';
  }
}

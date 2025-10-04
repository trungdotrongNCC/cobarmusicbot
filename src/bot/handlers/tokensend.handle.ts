import { OnEvent } from '@nestjs/event-emitter';
import { Events, TokenSentEvent } from 'mezon-sdk';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TokenSentEventHandler {
  private readonly logger = new Logger(TokenSentEventHandler.name);
  private readonly musicWebhookUrl = process.env.MUSIC_WEBHOOK_URL;

  constructor() {
    if (!this.musicWebhookUrl) {
      this.logger.warn('[INIT] MUSIC_WEBHOOK_URL is not set in .env');
    }
  }

  @OnEvent(Events.TokenSend)
  async handleRecharge(tokenEvent: TokenSentEvent) {
    console.log('Received TokenSend event:', tokenEvent);
    const amount = Number(tokenEvent.amount) || 0;
    if (amount <= 0) {
      this.logger.warn(`[TokenSend] Ignore amount <= 0: ${tokenEvent.amount}`);
      return;
    }

    const sessionId = this.extractSessionId(tokenEvent.note);
    if (!sessionId) {
      this.logger.warn(
        `[TokenSend] Missing session_id in note: ${tokenEvent.note ?? ''}`,
      );
      return;
    }

    if (!this.musicWebhookUrl) {
      this.logger.error('[TokenSend] MUSIC_WEBHOOK_URL not defined');
      return;
    }

    const body = {
      event_type: 'success',
      amount,
      metadata: {
        session_id: sessionId,
      },
    };

    try {
      const res = await fetch(this.musicWebhookUrl, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        this.logger.log(
          `[TokenSend] Sent callback to music webhook. session_id=${sessionId}, amount=${amount}`,
        );
      } else {
        const text = await res.text().catch(() => '');
        this.logger.error(
          `[TokenSend] Webhook responded with HTTP ${res.status}: ${text}`,
        );
      }
    } catch (err: any) {
      this.logger.error(`[TokenSend] Failed to call webhook`, {
        error: err?.message || err,
      });
    }
  }

  /** Bóc session_id từ note */
  private extractSessionId(note?: string | null): string | null {
    if (!note) return null;
    const s = String(note).trim();

    // JSON {"session_id":"..."} hoặc {"sessionId":"..."}
    try {
      const j = JSON.parse(s);
      const sid = j?.session_id || j?.sessionId;
      if (typeof sid === 'string' && sid.trim()) return sid.trim();
    } catch {}

    // session_id=xxxx
    const m1 = /session_id=([A-Za-z0-9_\-:.]+)/i.exec(s);
    if (m1?.[1]) return m1[1];

    // sid:xxxx
    const m2 = /sid:([A-Za-z0-9_\-:.]+)/i.exec(s);
    if (m2?.[1]) return m2[1];

    // UUID v4 trần
    const uuidV4 =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    if (uuidV4.test(s)) return s;

    // fallback: chuỗi không chứa khoảng trắng
    if (!/\s/.test(s)) return s;

    return null;
  }
}

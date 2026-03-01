import { NextRequest, NextResponse } from 'next/server';

// Telegram Bot Token
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8372057670:AAEyTCDslxr85sT-NtV6SunCz5CuQ2vfuiM';

interface SendCodeRequest {
  phone: string;
  code: string;
  name?: string;
  type?: 'verification' | 'password_reset';
}

export async function POST(request: NextRequest) {
  try {
    const body: SendCodeRequest = await request.json();
    const { phone, code, name, type } = body;

    if (!phone || !code) {
      return NextResponse.json(
        { success: false, error: 'Missing phone or code' },
        { status: 400 }
      );
    }

    // Try to find user by phone in our system
    // For now, we'll send to a chat ID if provided, or try to find by phone
    const usersStr = localStorage.getItem('users');
    const users = usersStr ? JSON.parse(usersStr) : [];
    const user = users.find((u: any) => u.phone === phone);

    const telegramChatId = user?.telegramChatId;

    let message = '';

    if (type === 'password_reset') {
      message = `🔐 *Восстановление пароля*\n\n`;
    } else {
      message = `✅ *Код подтверждения*\n\n`;
    }

    message += `Код: *${code}*\n\n`;
    message += `Введите этот код на сайте для подтверждения.\n`;
    message += `⏰ Код действителен 10 минут.`;

    // If we have a Telegram chat ID, send directly
    if (telegramChatId) {
      const telegramResponse = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: message,
            parse_mode: 'Markdown'
          })
        }
      );

      const telegramResult = await telegramResponse.json();

      if (telegramResult.ok) {
        return NextResponse.json({
          success: true,
          method: 'telegram',
          message: 'Код отправлен в Telegram!'
        });
      }
    }

    // If no Telegram chat ID, return instructions
    // In a real app, you'd need to link Telegram account first
    return NextResponse.json({
      success: true,
      demo: true,
      code: code,
      method: 'demo',
      message: '📱 Код показан на экране',
      note: 'Для получения кодов в Telegram, нужно привязать аккаунт'
    });

  } catch (error) {
    console.error('Telegram Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get bot info
export async function GET() {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`
    );
    const result = await response.json();

    return NextResponse.json({
      ok: result.ok,
      bot: result.result ? {
        name: result.result.first_name,
        username: result.result.username
      } : null
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: 'Failed to connect to Telegram'
    });
  }
}
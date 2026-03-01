import { NextRequest, NextResponse } from 'next/server';

// Telegram Bot Token
const TELEGRAM_BOT_TOKEN = '8372057670:AAEyTCDslxr85sT-NtV6SunCz5CuQ2vfuiM';

interface TelegramUpdate {
  update_id: number;
  message?: {
    from: {
      id: number;
      first_name: string;
      username?: string;
    };
    chat: {
      id: number;
      type: string;
    };
    text?: string;
  };
  callback_query?: {
    from: {
      id: number;
      first_name: string;
      username?: string;
    };
    data?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: TelegramUpdate = await request.json();
    
    // Handle /start command
    if (body.message?.text?.startsWith('/start')) {
      const chatId = body.message.chat.id;
      const firstName = body.message.from?.first_name || 'друг';
      const text = body.message.text;
      
      // Parse start parameter (could contain phone_code)
      const parts = text.split(' ');
      const startParam = parts[1] || '';
      
      let welcomeMessage = `👋 Привет, ${firstName}!\n\n`;
      welcomeMessage += `Я бот для подтверждения регистрации на DDS System.\n\n`;
      welcomeMessage += `📝 Для регистрации:\n`;
      welcomeMessage += `1. Перейдите на сайт\n`;
      welcomeMessage += `2. Введите номер телефона\n`;
      welcomeMessage += `3. Получите код здесь\n\n`;
      welcomeMessage += `🔐 Код действителен 10 минут.`;
      
      // Send welcome message
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: welcomeMessage,
          parse_mode: 'Markdown'
        })
      });
      
      return NextResponse.json({ ok: true });
    }
    
    // Handle any other message
    if (body.message) {
      const chatId = body.message.chat.id;
      const firstName = body.message.from?.first_name || 'друг';
      
      let responseMessage = `👋 Привет, ${firstName}!\n\n`;
      responseMessage += `Это бот для подтверждения регистрации DDS System.\n\n`;
      responseMessage += `📝 Чтобы получить код подтверждения:\n`;
      responseMessage += `1. Зарегистрируйтесь на сайте\n`;
      responseMessage += `2. Нажмите "Получить код в Telegram"\n\n`;
      responseMessage += `🔧 Техническая поддержка: @admin`;
      
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: responseMessage,
          parse_mode: 'Markdown'
        })
      });
    }
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram Webhook Error:', error);
    return NextResponse.json({ ok: false, error: 'Error processing update' });
  }
}

// For testing - get bot info
export async function GET() {
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`);
    const result = await response.json();
    
    return NextResponse.json({
      bot: result.result,
      message: 'Telegram bot is connected!',
      setupInstructions: 'To set webhook, use: https://api.telegram.org/bot<TOKEN>/setWebhook?url=<YOUR_WEBHOOK_URL>'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to connect to Telegram' });
  }
}
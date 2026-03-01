import { NextRequest, NextResponse } from 'next/server';

// SMS Pro (Кыргызстан) - https://smspro.nikita.kg
// ВАЖНО: Для SMS Pro нужен ЛОГИН и ПАРОЛЬ, а не API ключ Altegio!
// Получите их в личном кабинете smspro.nikita.kg
const SMSPRO_LOGIN = process.env.SMSPRO_LOGIN || '';
const SMSPRO_PASSWORD = process.env.SMSPRO_PASSWORD || '';
const SMSPRO_SENDER = process.env.SMSPRO_SENDER || 'DDS-SYSTEM';

// SMS.ru (Россия)
const SMSRU_API_KEY = process.env.SMSRU_API_KEY || '';
const SMSRU_SENDER = process.env.SMSRU_SENDER || 'DDS-SYSTEM';

// Country codes mapping
const countryCodes: Record<string, { country: string; provider: string }> = {
  '996': { country: 'Кыргызстан', provider: 'smspro' },
  '7': { country: 'Россия', provider: 'smsru' },
  '375': { country: 'Беларусь', provider: 'smsru' },
  '380': { country: 'Украина', provider: 'smsru' },
  '77': { country: 'Казахстан', provider: 'smsru' },
  '994': { country: 'Азербайджан', provider: 'smsru' },
  '992': { country: 'Таджикистан', provider: 'smsru' },
  '993': { country: 'Туркменистан', provider: 'smsru' },
  '998': { country: 'Узбекистан', provider: 'smsru' },
  '373': { country: 'Молдова', provider: 'smsru' },
  '374': { country: 'Армения', provider: 'smsru' },
  '995': { country: 'Грузия', provider: 'smsru' },
  '372': { country: 'Эстония', provider: 'smsru' },
  '371': { country: 'Латвия', provider: 'smsru' },
  '370': { country: 'Литва', provider: 'smsru' },
  '44': { country: 'Великобритания', provider: 'smsru' },
  '49': { country: 'Германия', provider: 'smsru' },
  '33': { country: 'Франция', provider: 'smsru' },
  '1': { country: 'США/Канада', provider: 'smsru' },
  '90': { country: 'Турция', provider: 'smsru' },
  '972': { country: 'Израиль', provider: 'smsru' },
  '81': { country: 'Япония', provider: 'smsru' },
  '82': { country: 'Южная Корея', provider: 'smsru' },
  '86': { country: 'Китай', provider: 'smsru' },
};

interface SMSRequest {
  phone: string;
  message: string;
  type?: 'verification' | 'password_reset';
}

// Send SMS via smspro.nikita.kg (using XML format)
async function sendSMSPro(phone: string, message: string): Promise<{ success: boolean; error?: string; smsId?: string; status?: number }> {
  try {
    const cleanPhone = phone.replace(/\D/g, '');
    const messageId = Date.now().toString();
    
    const xmlData = `<?xml version="1.0" encoding="UTF-8"?>
<message>
  <id>${messageId}</id>
  <login>${SMSPRO_LOGIN}</login>
  <pwd>${SMSPRO_PASSWORD}</pwd>
  <sender>${SMSPRO_SENDER}</sender>
  <text>${message}</text>
  <phones>
    <phone>${cleanPhone}</phone>
  </phones>
</message>`;

    const response = await fetch('https://smspro.nikita.kg/api/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
      },
      body: xmlData
    });

    const resultText = await response.text();
    console.log('SMS Pro response:', resultText);
    
    // Parse XML response
    const idMatch = resultText.match(/<id>(\d+)<\/id>/);
    const statusMatch = resultText.match(/<status>(\d+)<\/status>/);
    
    const status = statusMatch ? parseInt(statusMatch[1]) : -1;
    const smsId = idMatch ? idMatch[1] : '0';
    
    // Status codes:
    // 0 - Успешно принято
    // 1 - Ошибка формата
    // 2 - Неверная авторизация  
    // 5 - Неверное имя отправителя
    
    if (status === 0) {
      return { success: true, smsId, status };
    } else {
      const errorMessages: Record<number, string> = {
        1: 'Ошибка в формате запроса',
        2: 'Неверная авторизация. Проверьте логин и пароль в настройках.',
        3: 'Недопустимый IP-адрес',
        4: 'Недостаточно средств',
        5: 'Неверное имя отправителя. Подтвердите имя в личном кабинете.',
        6: 'Сообщение заблокировано (стоп-слова)',
        7: 'Неверный номер телефона',
        8: 'Неверный формат времени',
        9: 'Заблокировано SPAM фильтром',
      };
      return { success: false, error: errorMessages[status] || `Ошибка: ${status}`, status };
    }
  } catch (error) {
    console.error('SMSPro error:', error);
    return { success: false, error: 'Ошибка соединения с SMS сервисом' };
  }
}

// Send SMS via SMS.ru
async function sendSMSru(phone: string, message: string): Promise<{ success: boolean; error?: string; smsId?: string }> {
  try {
    const cleanPhone = phone.replace(/\D/g, '');
    
    const smsData = new URLSearchParams({
      api_id: SMSRU_API_KEY,
      to: cleanPhone,
      msg: message,
      from: SMSRU_SENDER,
      json: '1'
    });

    const response = await fetch('https://sms.ru/sms/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: smsData.toString()
    });

    const result = await response.json();

    if (result.status === 'OK') {
      return { success: true, smsId: result.sms_id };
    } else {
      return { success: false, error: result.status_text || 'Ошибка отправки SMS' };
    }
  } catch (error) {
    console.error('SMS.ru error:', error);
    return { success: false, error: 'Failed to send SMS' };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: SMSRequest = await request.json();
    const { phone, message } = body;

    if (!phone || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing phone or message' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\D/g, '');
    
    // Determine country and provider
    let provider = 'demo';
    for (const [code, info] of Object.entries(countryCodes)) {
      if (cleanPhone.startsWith(code)) {
        provider = info.provider;
        break;
      }
    }

    const isSmsProConfigured = SMSPRO_LOGIN && SMSPRO_PASSWORD;
    const isSmsRuConfigured = SMSRU_API_KEY && SMSRU_API_KEY !== 'YOUR_API_KEY_HERE';

    // Demo mode - no provider configured
    if (!isSmsProConfigured && !isSmsRuConfigured) {
      console.log('=== SMS (DEMO MODE) ===');
      console.log(`To: ${phone}`);
      console.log(`Message: ${message}`);
      console.log('========================');
      
      const demoCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      return NextResponse.json({
        success: true,
        demo: true,
        code: demoCode,
        message: '📱 Демо-режим: код показан на экране',
        configureInfo: {
          smspro: 'Для настройки SMS Pro добавьте в .env.local: SMSPRO_LOGIN и SMSPRO_PASSWORD',
          smsru: 'Для настройки SMS.ru добавьте в .env.local: SMSRU_API_KEY'
        },
        phone: phone
      });
    }

    // Send real SMS
    let result;
    
    if (provider === 'smspro' && isSmsProConfigured) {
      result = await sendSMSPro(phone, message);
    } else if (isSmsRuConfigured) {
      result = await sendSMSru(phone, message);
    } else {
      // Fallback to demo
      const demoCode = Math.floor(100000 + Math.random() * 900000).toString();
      return NextResponse.json({
        success: true,
        demo: true,
        code: demoCode,
        message: '⚠️ Провайдер для этой страны не настроен',
        phone: phone
      });
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: '✅ SMS успешно отправлен!',
        smsId: result.smsId,
        provider: provider
      });
    } else {
      // If auth error (status 2 or 5), fallback to demo mode
      const resultAny = result as { status?: number };
      if (resultAny.status === 2 || resultAny.status === 5) {
        const demoCode = Math.floor(100000 + Math.random() * 900000).toString();
        return NextResponse.json({
          success: true,
          demo: true,
          code: demoCode,
          message: `⚠️ ${result.error}. Пока показываем код на экране.`,
          warning: result.error,
          phone: phone
        });
      }
      
      return NextResponse.json({
        success: false,
        error: result.error || 'Ошибка отправки SMS'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('SMS Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET method to check API status
export async function GET() {
  const isSmsProConfigured = SMSPRO_LOGIN && SMSPRO_PASSWORD;
  const isSmsRuConfigured = SMSRU_API_KEY && SMSRU_API_KEY !== 'YOUR_API_KEY_HERE';
  
  return NextResponse.json({
    status: isSmsProConfigured || isSmsRuConfigured ? 'configured' : 'demo',
    configured: {
      smspro: isSmsProConfigured,
      smsru: isSmsRuConfigured
    },
    message: isSmsProConfigured 
      ? 'SMS Pro (Кыргызстан) настроен!'
      : isSmsRuConfigured 
        ? 'SMS.ru настроен!'
        : 'Демо-режим. Настройте SMS провайдера.',
    setupInstructions: {
      smspro: {
        url: 'https://smspro.nikita.kg',
        required: ['SMSPRO_LOGIN', 'SMSPRO_PASSWORD'],
        note: 'Получите логин и пароль в личном кабинете SMS Pro'
      },
      smsru: {
        url: 'https://sms.ru',
        required: ['SMSRU_API_KEY'],
        note: 'Получите API ключ в личном кабинете SMS.ru'
      }
    }
  });
}
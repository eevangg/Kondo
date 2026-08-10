// Telegram Bot Integration Helper (Environment-Based Secrets)

export function getTelegramCredentials() {
  const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || localStorage.getItem('homesync_telegram_bot_token') || '';
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID || localStorage.getItem('homesync_telegram_chat_id') || '';
  const isConfigured = Boolean(token && chatId && !token.includes('7123456789'));
  return { token, chatId, isConfigured };
}

export async function sendTelegramMessage(text) {
  const { token, chatId, isConfigured } = getTelegramCredentials();

  if (!isConfigured) {
    return {
      success: false,
      error: 'Telegram Bot credentials not configured in environment.'
    };
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown'
      })
    });

    const data = await response.json();

    if (data.ok) {
      return { success: true, message: '🚀 Sent to Telegram group chat!' };
    } else {
      console.error('Telegram API error:', data);
      return { success: false, error: data.description || 'Failed to send Telegram message.' };
    }
  } catch (err) {
    console.error('Network error sending Telegram message:', err);
    return { success: false, error: 'Network error. Please check internet connection.' };
  }
}

export async function sendTelegramPhoto(imageBlob, caption = '') {
  const { token, chatId, isConfigured } = getTelegramCredentials();

  if (!isConfigured) {
    return {
      success: false,
      error: 'Telegram Bot credentials not configured in environment.'
    };
  }

  const formData = new FormData();
  formData.append('chat_id', chatId);
  formData.append('photo', imageBlob, 'billing_statement.png');
  if (caption) {
    formData.append('caption', caption);
    formData.append('parse_mode', 'Markdown');
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (data.ok) {
      return { success: true, message: '🖼️ Billing Sheet Image sent to Telegram!' };
    } else {
      console.error('Telegram sendPhoto error:', data);
      return { success: false, error: data.description || 'Failed to send image to Telegram.' };
    }
  } catch (err) {
    console.error('Network error sending Telegram photo:', err);
    return { success: false, error: 'Network error. Please check internet connection.' };
  }
}

// Telegram Bot Integration Helper (Zero Browser alert() popups)

export function getTelegramCredentials() {
  const token = localStorage.getItem('homesync_telegram_bot_token') || '';
  const chatId = localStorage.getItem('homesync_telegram_chat_id') || '';
  const isConfigured = Boolean(token && chatId);
  return { token, chatId, isConfigured };
}

export function saveTelegramCredentials(token, chatId) {
  localStorage.setItem('homesync_telegram_bot_token', token.trim());
  localStorage.setItem('homesync_telegram_chat_id', chatId.trim());
}

export function clearTelegramCredentials() {
  localStorage.removeItem('homesync_telegram_bot_token');
  localStorage.removeItem('homesync_telegram_chat_id');
}

export async function sendTelegramMessage(text) {
  const { token, chatId, isConfigured } = getTelegramCredentials();

  if (!isConfigured) {
    return {
      success: false,
      error: 'Telegram Bot not configured. Please set Bot Token & Chat ID in Telegram settings.'
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
      error: 'Telegram Bot not configured. Please set Bot Token & Chat ID in Telegram settings.'
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

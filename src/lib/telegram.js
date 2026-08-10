// Telegram Bot Integration Helper

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
    try {
      await navigator.clipboard.writeText(text);
      alert('Telegram Bot not configured. Formatted text copied to clipboard! Configure Bot Token in settings for 1-click auto-sending.');
    } catch (e) {
      alert('Telegram Bot not configured. Please configure Bot Token & Chat ID in settings.');
    }
    return false;
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
      alert('🚀 Message sent directly to Telegram group chat!');
      return true;
    } else {
      console.error('Telegram API error:', data);
      alert(`Telegram Bot Error: ${data.description || 'Failed to send message'}`);
      return false;
    }
  } catch (err) {
    console.error('Network error sending Telegram message:', err);
    alert('Failed to reach Telegram API. Please check your internet connection.');
    return false;
  }
}

export async function sendTelegramPhoto(imageBlob, caption = '') {
  const { token, chatId, isConfigured } = getTelegramCredentials();

  if (!isConfigured) {
    alert('Telegram Bot not configured. Please configure Bot Token & Chat ID in settings pill first.');
    return false;
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
      alert('🖼️ High-resolution Billing Sheet image sent directly to Telegram group chat!');
      return true;
    } else {
      console.error('Telegram sendPhoto error:', data);
      alert(`Telegram Bot Photo Error: ${data.description || 'Failed to send image'}`);
      return false;
    }
  } catch (err) {
    console.error('Network error sending Telegram photo:', err);
    alert('Failed to send image to Telegram API. Please check internet connection.');
    return false;
  }
}

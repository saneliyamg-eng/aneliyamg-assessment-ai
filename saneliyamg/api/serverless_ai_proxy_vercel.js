// Serverless-функция для безопасного вызова Gemini API без раскрытия ключа в браузере.
// Разместите этот файл по пути: api/assess.js (для Vercel)

export default async function handler(req, res) {
  // Разрешаем только POST-запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
  }

  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const upstreamResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const data = await upstreamResponse.json();
    return res.status(upstreamResponse.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Proxy request failed' });
  }
}
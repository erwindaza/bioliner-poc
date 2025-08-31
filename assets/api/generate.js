// api/generate.js - Función Segura en Vercel (Versión a Prueba de Balas)

export default async function handler(request, response) {
  // 1. Envolvemos TODO en un try...catch para que NUNCA crashee
  try {
    if (request.method !== 'POST') {
      return response.status(405).json({ error: 'Método no permitido.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("ERROR CRÍTICO: GEMINI_API_KEY no está configurada en Vercel.");
      return response.status(500).json({ error: 'Error de configuración del servidor: Falta la API Key.' });
    }

    const { userIdea } = request.body;
    if (!userIdea || typeof userIdea !== 'string' || userIdea.trim() === '') {
      return response.status(400).json({ error: 'La descripción del proyecto no puede estar vacía.' });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    const systemPrompt = `Actúa como un ingeniero experto en geosintéticos de la empresa Bioliner. 
    Tu tarea es tomar la idea de un cliente y convertirla en una descripción técnica breve y profesional.
    - Usa un tono profesional y confiado.
    - Menciona materiales clave como "geomembranas HDPE" o "geotextiles".
    - Estructura la respuesta en 2 o 3 párrafos cortos.
    - Siempre termina con un llamado a la acción para contactar a Bioliner para una cotización formal.`;

    const payload = {
        contents: [{ parts: [{ text: `Idea del cliente: "${userIdea}"` }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
    };

    const geminiResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    const result = await geminiResponse.json();

    if (!geminiResponse.ok) {
        const errorMessage = result?.error?.message || 'Error desconocido desde la API de Gemini.';
        console.error("Error desde la API de Gemini:", errorMessage);
        throw new Error(errorMessage);
    }

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
        throw new Error('La respuesta de la IA no contenía texto válido.');
    }

    return response.status(200).json({ text });

  } catch (error) {
    console.error("Error en la función del servidor (api/generate.js):", error.message);
    return response.status(500).json({ error: `Hubo un problema en nuestros servidores: ${error.message}` });
  }
}


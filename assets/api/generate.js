// api/generate.js - Nuestra Función Segura en Vercel

export default async function handler(request, response) {
  // Solo permitimos peticiones POST
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { userIdea } = request.body;
    if (!userIdea) {
      return response.status(400).json({ error: 'La idea del proyecto es requerida.' });
    }

    // Obtenemos la llave secreta de las variables de entorno de Vercel
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("API Key no configurada en el servidor.");
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

    if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error("Error desde la API de Gemini:", errorText);
        throw new Error(`Error en la API de Gemini: ${geminiResponse.statusText}`);
    }

    const result = await geminiResponse.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
        throw new Error('No se recibió una respuesta válida de la IA.');
    }

    // Enviamos la respuesta de vuelta al navegador
    return response.status(200).json({ text });

  } catch (error) {
    console.error("Error en la función del servidor:", error);
    return response.status(500).json({ error: 'Hubo un problema en el servidor al generar la descripción.' });
  }
}
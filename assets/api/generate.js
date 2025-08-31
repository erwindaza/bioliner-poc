// api/generate.js - Función Segura en Vercel (Versión de Diagnóstico)

export default async function handler(request, response) {
  console.log("-----------------------------------------");
  console.log("Función /api/generate iniciada.");

  try {
    if (request.method !== 'POST') {
      console.log("Error: Método no permitido. Se recibió:", request.method);
      return response.status(405).json({ error: 'Método no permitido.' });
    }
    console.log("Paso 1: Método POST verificado.");

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("ERROR CRÍTICO: La variable de entorno GEMINI_API_KEY no está configurada en Vercel.");
      return response.status(500).json({ error: 'Error de configuración del servidor: Falta la API Key.' });
    }
    console.log("Paso 2: API Key encontrada en Vercel.");

    const { userIdea } = request.body;
    if (!userIdea || typeof userIdea !== 'string' || userIdea.trim() === '') {
      console.log("Error: La idea del proyecto venía vacía.");
      return response.status(400).json({ error: 'La descripción del proyecto no puede estar vacía.' });
    }
    console.log("Paso 3: Idea recibida del usuario:", userIdea);

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
    
    console.log("Paso 4: Preparando la llamada a la API de Gemini...");
    const geminiResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    console.log("Paso 5: Respuesta recibida de Gemini. Status:", geminiResponse.status);

    const result = await geminiResponse.json();

    if (!geminiResponse.ok) {
        const errorMessage = result?.error?.message || 'Error desconocido desde la API de Gemini.';
        console.error("ERROR desde la API de Gemini:", errorMessage);
        throw new Error(errorMessage);
    }

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
        throw new Error('La respuesta de la IA no contenía texto válido.');
    }
    
    console.log("Paso 6: Éxito. Enviando texto de vuelta al navegador.");
    return response.status(200).json({ text });

  } catch (error) {
    console.error("ERROR FINAL en la función del servidor:", error.message);
    return response.status(500).json({ error: `Hubo un problema en nuestros servidores: ${error.message}` });
  }
}
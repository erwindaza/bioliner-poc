// Escuchamos a que todo el contenido de la página cargue antes de ejecutar el script.
document.addEventListener('DOMContentLoaded', () => {

    // --- INICIALIZACIÓN DE AOS (ANIMATE ON SCROLL) ---
    AOS.init({
        duration: 800, // Duración de la animación en milisegundos
        once: true,    // La animación solo ocurre una vez
    });

    // --- LÓGICA DEL ASISTENTE DE IA CON GEMINI ---
    const generateBtn = document.getElementById('generate-btn');
    const projectIdea = document.getElementById('project-idea');
    const resultContainer = document.getElementById('ai-result-container');

    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            const userIdea = projectIdea.value;
            if (!userIdea) {
                alert('Por favor, describe tu idea de proyecto.');
                return;
            }

            // Mostrar un spinner de carga
            resultContainer.innerHTML = '<div class="loading-spinner"></div>';
            generateBtn.disabled = true;
            generateBtn.textContent = 'Generando...';
            
            const systemPrompt = `Actúa como un ingeniero experto en geosintéticos de la empresa Bioliner. 
            Tu tarea es tomar la idea de un cliente y convertirla en una descripción técnica breve y profesional.
            - Usa un tono profesional y confiado.
            - Menciona materiales clave como "geomembranas HDPE" o "geotextiles".
            - Estructura la respuesta en 2 o 3 párrafos cortos.
            - Siempre termina con un llamado a la acción para contactar a Bioliner para una cotización formal.`;

            const userQuery = `Idea del cliente: "${userIdea}"`;

            try {
                const apiKey = ""; 
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
                
                const payload = {
                    contents: [{ parts: [{ text: userQuery }] }],
                    systemInstruction: {
                        parts: [{ text: systemPrompt }]
                    },
                };

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error(`Error en la API: ${response.statusText}`);
                }

                const result = await response.json();
                const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

                if (text) {
                    resultContainer.innerHTML = `<div class="ai-result-box">${text.replace(/\n/g, '<br>')}</div>`;
                } else {
                    throw new Error('No se recibió una respuesta válida de la IA.');
                }

            } catch (error) {
                console.error('Error al llamar a la API de Gemini:', error);
                resultContainer.innerHTML = `<div class="status-error">Hubo un problema al generar la descripción. Por favor, inténtalo de nuevo.</div>`;
            } finally {
                generateBtn.disabled = false;
                generateBtn.textContent = 'Generar Descripción';
            }
        });
    }

    // --- LÓGICA DEL FORMULARIO DE CONTACTO ---
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // ===================================================================
            // URL CORRECTA INSERTADA AQUÍ
            // ===================================================================
            const formspreeEndpoint = 'https://formspree.io/f/mpwjraow'; 

            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            formStatus.innerHTML = '';

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(formspreeEndpoint, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatus.innerHTML = `<div class="status-success">¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.</div>`;
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                         formStatus.innerHTML = `<div class="status-error">${data["errors"].map(error => error["message"]).join(", ")}</div>`
                    } else {
                        throw new Error(data.error || 'Hubo un error en el servidor.');
                    }
                }

            } catch (error) {
                console.error('Error al enviar el formulario:', error);
                formStatus.innerHTML = `<div class="status-error">No se pudo enviar el mensaje. Por favor, inténtalo de nuevo.</div>`;
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar Mensaje';
            }
        });
    }
});
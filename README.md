Proyecto Bioliner - Prueba de Concepto (PoC)
Este repositorio contiene el código fuente y la documentación para la prueba de concepto del sitio web de Bioliner, una empresa especializada en soluciones de geosintéticos e ingeniería ambiental.
El sitio fue desarrollado siguiendo un flujo de trabajo moderno, priorizando la velocidad de carga, una experiencia de usuario profesional (UI/UX) y la integración de tecnologías de inteligencia artificial.

🚀 Tecnologías y Servicios Utilizados (Tech Stack)
Este proyecto no es un sitio web estático simple; es una aplicación web moderna construida con las siguientes herramientas:
Frontend:
HTML5: Para la estructura semántica del contenido.
CSS3: Para el diseño visual, con un enfoque en la adaptabilidad a cualquier dispositivo (diseño responsivo).
JavaScript (ES6+): Para la interactividad, validación de formularios y la comunicación con APIs.
Control de Versiones y Despliegue (CI/CD):
Git: Para el control de versiones local.
GitHub: Como repositorio remoto para el código fuente.
Vercel: Plataforma de hosting y despliegue continuo. Se conecta directamente a GitHub para automatizar la publicación del sitio.
APIs y Servicios de Terceros:
Formspree: Servicio que gestiona el envío de los formularios de contacto sin necesidad de un backend propio.
Google Gemini API: Se utiliza para la funcionalidad del "Asistente de Proyectos IA", generando descripciones técnicas a partir de las ideas de los usuarios.
Librerías y Animaciones:
AOS (Animate On Scroll): Para añadir animaciones sutiles a los elementos a medida que el usuario se desplaza por la página.
📂 Estructura del Proyecto
El proyecto está organizado de una manera limpia y escalable, separando la estructura, los estilos, la lógica y los recursos.
/
├── api/
│   └── generate.js       # Función "Serverless" segura que se ejecuta en Vercel para llamar a la API de Gemini.
├── assets/
│   ├── css/
│   │   └── style.css     # Hoja de estilos principal con todo el diseño avanzado.
│   ├── js/
│   │   └── script.js     # Lógica del formulario, llamadas a la API de IA y animaciones.
│   └── images/
│       └── (imágenes)    # Todas las imágenes de alta calidad del sitio.
├── public/
│   ├── index.html        # El archivo principal HTML (movido aquí para la configuración de Vercel).
│   └── (otros archivos)  # En el futuro, otros archivos públicos como robots.txt o sitemap.xml irían aquí.
├── .gitignore            # Archivo que le dice a Git qué ignorar (ej. node_modules).
├── package.json          # Archivo de configuración del proyecto para Vercel y Node.js.
└── README.md             # Esta documentación.


⚙️ Flujo de Trabajo: Desarrollo y Producción
Para garantizar que el sitio en producción (bioliner.cl) nunca se rompa, utilizamos un flujo de trabajo basado en ramas de Git.
Rama main (Producción): Esta rama refleja exactamente lo que se ve en https://bioliner.cl. Nunca se trabaja directamente sobre ella.
Ramas de Desarrollo (ej. dev-nueva-seccion): Para cualquier cambio (un nuevo servicio, corregir un texto, etc.), se crea una nueva rama a partir de main.
Despliegues de Vista Previa (Preview): Al subir una nueva rama de desarrollo a GitHub (git push origin dev-nueva-seccion), Vercel crea automáticamente un despliegue de vista previa con una URL única. Este es el entorno de pruebas (dev) para revisar los cambios en un entorno real.
Pull Request (PR): Una vez que los cambios son aprobados en el entorno de vista previa, se crea un "Pull Request" en GitHub para fusionar la rama de desarrollo con la rama main.
Merge a Producción: Al aceptar el "merge", los cambios se incorporan a main. Vercel detecta esta actualización y despliega automáticamente la nueva versión en el dominio de producción.
🔧 Mantenimiento y Actualizaciones
Para hacer cualquier cambio futuro en el sitio web, sigue estos pasos:
Sincroniza tu rama main local:
git checkout main
git pull origin main


Crea una nueva rama para tus cambios:
git checkout -b dev-nombre-del-cambio


Realiza tus modificaciones en los archivos (index.html, style.css, etc.).
Guarda y sube tus cambios a la nueva rama:
git add .
git commit -m "feat: Describo el cambio que hice"
git push origin dev-nombre-del-cambio


Revisa el link de vista previa que Vercel generará.
Crea y fusiona el Pull Request en GitHub para pasar a producción.
Documentación generada el 31 de Agosto de 2025. Este proyecto es el resultado de un proceso de desarrollo iterativo y colaborativo.

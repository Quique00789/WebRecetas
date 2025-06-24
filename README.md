WebRecetas
===================

Este es un proyecto desarrollado con **React**, **Vite** y **TypeScript**, utilizando herramientas como **Tailwind CSS** y **Firebase**.

🚀 Requisitos
-------------

Asegúrate de tener instalado:

- Node.js (versión recomendada: LTS)
- npm (se instala junto con Node.js)

Verifica la instalación ejecutando en la terminal:

    node -v
    npm -v

🔧 Instalación
--------------

1. Clona este repositorio:

    git clone https://github.com/Quique00789/WebRecetas.git

2. Accede a la carpeta del proyecto:

    cd WebRecetas

3. Instala las dependencias:

    npm install

4. Crea un archivo `.env` con tus variables de entorno necesarias (por ejemplo, para Firebase).

▶️ Ejecutar en modo desarrollo
------------------------------

Ejecuta el siguiente comando para iniciar el servidor de desarrollo:

    npm run dev

Luego abre tu navegador y accede a:

    http://localhost:5173/

📁 Estructura del Proyecto
--------------------------

    .
    ├── .env
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    ├── vite.config.ts
    ├── tsconfig.json
    ├── src/
    │   ├── App.tsx
    │   ├── index.css
    │   ├── main.tsx
    │   ├── vite-env.d.ts
    │   ├── components/
    │   │   ├── FeaturedRecipes.tsx
    │   │   ├── Footer.tsx
    │   │   ├── Header.tsx
    │   │   ├── RecipeCard.tsx
    │   │   ├── RecipeGrid.tsx
    │   │   ├── RecipeHeader.tsx
    │   │   ├── RecipeIngredients.tsx
    │   │   ├── RecipeInstructions.tsx
    │   │   └── RecipeMenu.tsx
    │   ├── contexts/
    │   │   └── AuthContext.tsx
    │   ├── data/
    │   │   └── recipes.ts
    │   ├── lib/
    │   │   └── firebase.ts
    │   ├── pages/
    │   │   ├── BrowsePage.tsx
    │   │   ├── CategoryPage.tsx
    │   │   ├── HomePage.tsx
    │   │   ├── LoginPage.tsx
    │   │   ├── ProfilePage.tsx
    │   │   ├── RecipeDetailPage.tsx
    │   │   ├── RegisterPage.tsx
    │   │   ├── SearchPage.tsx
    │   │   └── SubmitRecipePage.tsx
    │   └── types/
    │       └── index.ts

🛠️ Tecnologías y herramientas
------------------------------

- React + Vite
- TypeScript
- Tailwind CSS
- Firebase
- Context API
- Eslint

📦 Scripts disponibles
----------------------

- `npm run dev` – Inicia el servidor de desarrollo
- `npm run build` – Genera una versión optimizada para producción
- `npm run preview` – Previsualiza el build en local

📝 Notas
--------

- Recuerda configurar correctamente las variables de entorno en el archivo `.env`.
- Si estás utilizando autenticación o base de datos en Firebase, asegúrate de tener tus credenciales correctamente configuradas.

--------------------------------------------------

Desarrollado por:
Quique007
MiguelV467
Yos-po
MildredVil

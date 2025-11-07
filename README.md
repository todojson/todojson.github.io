# 📦 Gestor de Archivos JSON para GitHub Pages

Gestor visual de archivos JSON. Visualiza, copia URLs y descarga tus archivos JSON para usarlos en tus proyectos.

## 🚀 Desplegar en GitHub Pages

1. **Sube todos los archivos a tu repositorio GitHub**
   ```bash
   git add .
   git commit -m "Gestor de archivos JSON"
   git push origin main
   ```

2. **Activa GitHub Pages**
   - Ve a Settings de tu repositorio
   - Sección "Pages"
   - En "Source" selecciona la rama `main`
   - Guarda

3. **Accede a tu sitio**
   - Tu gestor estará en: `https://todojson.github.io/`
   - Espera 1-2 minutos para que se despliegue

## 📝 Agregar más archivos JSON

1. Sube tu archivo `.json` al repositorio
2. Edita `app.js` y agrégalo en `JSON_FILES`:

```javascript
const JSON_FILES = [
    {
        name: 'tasks.json',
        description: 'Lista de tareas con 30 registros',
        icon: '📋'
    },
    {
        name: 'products.json',
        description: 'Catálogo de productos',
        icon: '🛍️'
    },
    {
        name: 'users.json',
        description: 'Base de datos de usuarios',
        icon: '👥'
    }
    // Agrega los que necesites
];
```

3. Guarda, haz commit y push

## 📡 Usar los JSON en tus proyectos

Accede a tus archivos JSON desde cualquier aplicación:

```javascript
fetch('https://todojson.github.io/tasks.json')
  .then(response => response.json())
  .then(data => console.log(data));
```

```python
import requests
response = requests.get('https://todojson.github.io/tasks.json')
data = response.json()
```

```html
<!-- Directamente en HTML -->
<script>
  fetch('https://todojson.github.io/tasks.json')
    .then(r => r.json())
    .then(data => {
      // Usa tus datos aquí
    });
</script>
```

## ✨ Características

- ✅ Visualización de archivos JSON con tarjetas
- ✅ Búsqueda en tiempo real
- ✅ Copiar URL del archivo con un clic
- ✅ Copiar contenido JSON completo
- ✅ Descargar archivos localmente
- ✅ Vista previa formateada y coloreada
- ✅ Estadísticas automáticas (total archivos, registros)
- ✅ Diseño responsive (móvil y desktop)
- ✅ Sin dependencias externas

## 📁 Archivos del proyecto

```
├── index.html      # Página principal del gestor
├── app.js          # Lógica y funcionalidad
├── styles.css      # Estilos y diseño
├── tasks.json      # Ejemplo: archivo JSON con tareas
└── README.md       # Esta documentación
```

## 🎯 URLs de acceso

Una vez desplegado en GitHub Pages:

- **Gestor:** `https://todojson.github.io/`
- **JSON directo:** `https://todojson.github.io/nombre-archivo.json`

## 💡 Ejemplo de uso

Si subes un archivo `products.json`, podrás:
1. Verlo visualmente en `https://todojson.github.io/`
2. Acceder directamente desde código en `https://todojson.github.io/products.json`
3. Copiar la URL con un clic desde el gestor
4. Ver el contenido formateado en el modal
5. Descargarlo si lo necesitas

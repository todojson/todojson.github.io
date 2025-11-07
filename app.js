// Configuración del gestor de JSON
const JSON_FILES = [
    {
        name: 'tasks.json',
        description: 'Lista de tareas con 30 registros',
        icon: '📋'
    }
    // Agrega más archivos JSON aquí
];

// Variables globales
let allJsonFiles = [];
let filteredFiles = [];

// Elementos del DOM
const jsonContainer = document.getElementById('jsonContainer');
const searchInput = document.getElementById('searchInput');
const addJsonBtn = document.getElementById('addJsonBtn');
const refreshBtn = document.getElementById('refreshBtn');
const noResults = document.getElementById('noResults');

// Modal
const modal = document.getElementById('jsonModal');
const modalTitle = document.getElementById('modalTitle');
const jsonContent = document.getElementById('jsonContent');
const closeModal = document.querySelector('.close');
const copyUrlBtn = document.getElementById('copyUrlBtn');
const copyDataBtn = document.getElementById('copyDataBtn');
const downloadBtn = document.getElementById('downloadBtn');

// Estadísticas
const totalFilesEl = document.getElementById('totalFiles');
const totalRecordsEl = document.getElementById('totalRecords');

// Cargar datos al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadJsonFiles();
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    searchInput.addEventListener('input', filterFiles);
    refreshBtn.addEventListener('click', loadJsonFiles);
    addJsonBtn.addEventListener('click', showAddJsonInfo);
    closeModal.addEventListener('click', hideModal);
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) hideModal();
    });
}

// Cargar archivos JSON
async function loadJsonFiles() {
    try {
        jsonContainer.innerHTML = '<div class="loading">Cargando archivos JSON</div>';
        
        allJsonFiles = [];
        let totalRecords = 0;
        
        for (const file of JSON_FILES) {
            try {
                const response = await fetch(file.name);
                if (response.ok) {
                    const data = await response.json();
                    const fileSize = JSON.stringify(data).length;
                    const recordCount = Array.isArray(data) ? data.length : Object.keys(data).length;
                    
                    allJsonFiles.push({
                        ...file,
                        data: data,
                        size: fileSize,
                        records: recordCount,
                        url: `${window.location.origin}${window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1)}${file.name}`
                    });
                    
                    totalRecords += recordCount;
                }
            } catch (err) {
                console.error(`Error cargando ${file.name}:`, err);
            }
        }
        
        filteredFiles = [...allJsonFiles];
        updateStats(totalRecords);
        renderFiles();
    } catch (error) {
        console.error('Error:', error);
        jsonContainer.innerHTML = '<div class="no-results"><p>❌ Error al cargar los archivos JSON</p></div>';
    }
}

// Filtrar archivos
function filterFiles() {
    const searchTerm = searchInput.value.toLowerCase();
    
    filteredFiles = allJsonFiles.filter(file => 
        file.name.toLowerCase().includes(searchTerm) ||
        (file.description && file.description.toLowerCase().includes(searchTerm))
    );
    
    renderFiles();
}

// Actualizar estadísticas
function updateStats(totalRecords) {
    totalFilesEl.textContent = allJsonFiles.length;
    totalRecordsEl.textContent = totalRecords;
}

// Renderizar archivos
function renderFiles() {
    if (filteredFiles.length === 0) {
        jsonContainer.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    jsonContainer.style.display = 'grid';
    noResults.style.display = 'none';
    
    jsonContainer.innerHTML = filteredFiles.map(file => createFileCard(file)).join('');
    
    // Agregar event listeners a las tarjetas
    document.querySelectorAll('.json-card').forEach((card, index) => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('json-btn')) {
                showJsonModal(filteredFiles[index]);
            }
        });
    });
    
    // Event listeners para botones
    document.querySelectorAll('.view-btn').forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            showJsonModal(filteredFiles[index]);
        });
    });
    
    document.querySelectorAll('.copy-btn').forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            copyUrl(filteredFiles[index].url);
        });
    });
}

// Crear tarjeta de archivo
function createFileCard(file) {
    const sizeInKB = (file.size / 1024).toFixed(2);
    
    return `
        <div class="json-card">
            <div class="json-header">
                <div class="json-icon">${file.icon}</div>
                <div class="json-title">
                    <div class="json-name">${escapeHtml(file.name)}</div>
                    <div class="json-size">${sizeInKB} KB</div>
                </div>
            </div>
            
            ${file.description ? `<p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">${escapeHtml(file.description)}</p>` : ''}
            
            <div class="json-info">
                <div class="json-info-item">
                    <span class="json-info-label">Registros:</span>
                    <span class="json-info-value">${file.records}</span>
                </div>
                <div class="json-info-item">
                    <span class="json-info-label">Tipo:</span>
                    <span class="json-info-value">${Array.isArray(file.data) ? 'Array' : 'Object'}</span>
                </div>
            </div>
            
            <div class="json-actions">
                <button class="json-btn view-btn">👁️ Ver</button>
                <button class="json-btn secondary copy-btn">🔗 URL</button>
            </div>
        </div>
    `;
}

// Mostrar modal con JSON
function showJsonModal(file) {
    modalTitle.textContent = file.name;
    jsonContent.textContent = JSON.stringify(file.data, null, 2);
    modal.classList.add('show');
    
    // Configurar botones del modal
    copyUrlBtn.onclick = () => copyUrl(file.url);
    copyDataBtn.onclick = () => copyJsonData(file.data);
    downloadBtn.onclick = () => downloadJson(file.name, file.data);
}

// Ocultar modal
function hideModal() {
    modal.classList.remove('show');
}

// Copiar URL al portapapeles
async function copyUrl(url) {
    try {
        await navigator.clipboard.writeText(url);
        showNotification('✅ URL copiada al portapapeles', 'success');
    } catch (err) {
        showNotification('❌ Error al copiar URL', 'error');
    }
}

// Copiar JSON al portapapeles
async function copyJsonData(data) {
    try {
        await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        showNotification('✅ JSON copiado al portapapeles', 'success');
    } catch (err) {
        showNotification('❌ Error al copiar JSON', 'error');
    }
}

// Descargar JSON
function downloadJson(filename, data) {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', filename);
    linkElement.click();
    
    showNotification('💾 Archivo descargado', 'success');
}

// Mostrar información para agregar JSON
function showAddJsonInfo() {
    alert(`Para agregar un nuevo archivo JSON:

1. Sube tu archivo .json al repositorio
2. Edita el archivo app.js
3. Agrega una entrada en JSON_FILES:

{
    name: 'tu-archivo.json',
    description: 'Descripción del archivo',
    icon: '📄'
}

4. Guarda y actualiza la página`);
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--danger-color)' : 'var(--info-color)'};
        color: white;
        border-radius: 10px;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Escapar HTML para prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Mensaje de bienvenida en consola
console.log('%c📦 Gestor de Archivos JSON', 'font-size: 20px; color: #3b82f6; font-weight: bold;');
console.log('%cSistema cargado correctamente', 'color: #10b981;');
console.log('Archivos JSON disponibles:', JSON_FILES.length);

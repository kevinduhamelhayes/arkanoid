/**
 * Clase para gestionar la carga de recursos (imágenes)
 */
export class AssetLoader {
  constructor() {
    this.assets = {};
    this.totalAssets = 0;
    this.loadedAssets = 0;
    this.onLoadCallback = null;
  }

  /**
   * Añade una imagen para ser cargada
   * @param {string} key - Clave para acceder a la imagen
   * @param {string} src - Ruta de la imagen
   */
  addImage(key, src) {
    this.totalAssets++;
    
    this.assets[key] = new Image();
    this.assets[key].src = src;
    this.assets[key].onload = () => this._handleAssetLoad();
    this.assets[key].onerror = (err) => console.error(`Error al cargar la imagen ${key}:`, err);
  }

  /**
   * Gestiona la carga de un recurso
   * @private
   */
  _handleAssetLoad() {
    this.loadedAssets++;
    if (this.loadedAssets === this.totalAssets && this.onLoadCallback) {
      this.onLoadCallback();
    }
  }

  /**
   * Establece la función de callback para cuando todos los recursos están cargados
   * @param {Function} callback - Función a ejecutar cuando todo esté cargado
   */
  onLoadComplete(callback) {
    this.onLoadCallback = callback;
    
    // Si ya están todos cargados, ejecutamos el callback
    if (this.loadedAssets === this.totalAssets && this.totalAssets > 0) {
      this.onLoadCallback();
    }
  }

  /**
   * Obtiene una imagen cargada
   * @param {string} key - Clave de la imagen
   * @returns {HTMLImageElement} - La imagen solicitada
   */
  getImage(key) {
    return this.assets[key];
  }
} 
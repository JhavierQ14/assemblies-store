// Funciones para manejar el almacenamiento de tokens y perfil de usuario en localStorage

/**
 * Guarda los tokens de autenticación en localStorage
 * @param {Object} tokens - Objeto con access_token y refresh_token
 */
export function saveTokens(tokens) {
  if (tokens?.access_token) {
    localStorage.setItem('access_token', tokens.access_token);
  }
  if (tokens?.refresh_token) {
    localStorage.setItem('refresh_token', tokens.refresh_token);
  }
}

/**
 * Guarda el perfil del usuario en localStorage
 * @param {Object} profile - Objeto con datos del usuario (id, name, email, etc)
 */
export function saveUserProfile(profile) {
  if (profile) {
    localStorage.setItem('user_profile', JSON.stringify(profile));
  }
}

/**
 * Obtiene los tokens de autenticación del localStorage
 * @returns {Object} Objeto con access_token y refresh_token
 */
export function getTokens() {
  return {
    access_token: localStorage.getItem('access_token'),
    refresh_token: localStorage.getItem('refresh_token')
  };
}

/**
 * Obtiene el perfil del usuario del localStorage
 * @returns {Object|null} Objeto con datos del usuario o null si no existe
 */
export function getUserProfile() {
  const profile = localStorage.getItem('user_profile');
  return profile ? JSON.parse(profile) : null;
}

/**
 * Limpia todos los datos de autenticación del localStorage
 */
export function clearAuthData() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_profile');
}

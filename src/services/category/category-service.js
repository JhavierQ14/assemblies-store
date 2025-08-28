// Servicio para obtener categorías y subcategorías desde el backend
import axios from 'axios';
const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8081/api';


export async function fetchCategories() {
  console.log('[fetchCategories] PETICIÓN: GET', `${BASE}/categorie/find-all`);
  const res = await axios.get(`${BASE}/categorie/find-all`);
  console.log('[fetchCategories] RESPUESTA:', res.data);
  
  // Procesar categorías sin filtrar por campos que no existen
  const processedCategories = res.data.map(cat => ({
    id: cat.id || cat.name.toLowerCase().replace(/\s+/g, '-'), // Usar id o generar uno desde el nombre
    name: cat.name,
    description: cat.description,
    imageUrl: cat.imageUrl?.url || cat.imageUrl || '', // Usar 'imageUrl.url' primero, luego 'imageUrl' como fallback
    subCategories: (cat.subCategories || []).map(sub => ({
      id: sub.id || sub.name.toLowerCase().replace(/\s+/g, '-'), // Mismo para subcategorías
      name: sub.name,
      description: sub.description || ''
    }))
  }));
  
  console.log('[fetchCategories] CATEGORÍAS PROCESADAS:', processedCategories);
  return processedCategories;
}

// Resolve caminhos do content.js ('fotos/x.jpg') respeitando a base do site.
export function asset(caminho) {
  if (!caminho) return caminho
  if (/^(https?:|data:|blob:|\/)/.test(caminho)) return caminho
  return import.meta.env.BASE_URL + caminho.replace(/^\.\//, '')
}

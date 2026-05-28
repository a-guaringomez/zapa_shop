export function formatearCOP(monto) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(monto);
}

export function imgFallback(img) {
  img.style.display = 'none';
  const wrapper = img.parentElement;
  const icono = wrapper.dataset.icono || 'bi-bag';
  wrapper.innerHTML = `<i class="bi ${icono} product-fallback-icon"></i>`;
}

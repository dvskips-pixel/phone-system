(function () {
  'use strict';

  const logoUrl = new URL('assets/images/spectrum-credit-logo.svg', document.baseURI).href;
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = new URL('dashboard.css', document.baseURI).href;
  document.head.append(style);

  function setLogo(container) {
    if (!container) return;
    const current = container.querySelector('img');
    if (current && current.src === logoUrl) return;
    const image = document.createElement('img');
    image.className = container.matches('.sidebar-brand .brand') ? 'brand-logo sidebar-logo' : 'brand-logo';
    image.src = logoUrl;
    image.alt = '';
    container.replaceChildren(image);
  }

  function applyLogos() {
    setLogo(document.querySelector('#sidebarBrand .brand'));
    document.querySelectorAll('#loginScreen .login-brand-logo, #loginScreen .login-mini-logo')
      .forEach(setLogo);
  }

  function applyAdminMetrics() {
    const role = document.querySelector('[data-act="role"]')?.value;
    if (role !== 'Super Admin') return;

    const metrics = document.querySelector('#view .metrics:not(.admin-metrics)');
    if (!metrics) return;
    const cards = [...metrics.querySelectorAll('.metric-card')];
    if (cards.length !== 4 || cards[0].querySelector('h2')?.textContent.trim() !== 'Outstanding receivables') return;

    const outstanding = cards[0];
    const activeCount = outstanding.querySelector('.metric-note')?.textContent.match(/(\d+)\s+active leases?/i)?.[1] || '0';
    outstanding.querySelector('h2').textContent = 'Outstanding';
    outstanding.querySelector('.metric-note').textContent = 'Still to collect';

    const active = document.createElement('div');
    active.className = 'metric-card';
    active.innerHTML = `<h2>Active leases</h2><p class="metric-value">${activeCount}</p><p class="metric-note">Leases in force</p>`;
    outstanding.after(active);

    const notes = cards[3].querySelector('.metric-note');
    if (notes) notes.textContent = 'Decisions and handovers';
    metrics.classList.add('admin-metrics');
  }

  function removeForgedCallbackAction() {
    document.querySelectorAll('#view button').forEach(button => {
      if (button.textContent.trim() === 'Send a forged callback') button.remove();
    });
  }

  function filterInventoryNavigation() {
    const isInventoryOfficer = document.querySelector('[data-act="role"]')?.value === 'Inventory Officer';
    if (!isInventoryOfficer) return;

    document.querySelectorAll('#nav button[data-act="nav"]').forEach(button => {
      if (['applications', 'leases', 'payments', 'collections'].includes(button.dataset.id)) button.remove();
    });
  }

  function update() {
    applyLogos();
    applyAdminMetrics();
    removeForgedCallbackAction();
    filterInventoryNavigation();
  }

  update();
  new MutationObserver(update).observe(document.body, { childList: true, subtree: true });
})();

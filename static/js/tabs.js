// static/js/tabs.js
// Robust tab handling: supports data-target, href, aria-controls, or fallback panel id
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.tabs.tabs-ppnc').forEach(container => {
    // create indicator if not present
    let indicator = container.querySelector('.tab-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'tab-indicator';
      container.appendChild(indicator);
    }

    const tabs = Array.from(container.querySelectorAll('.tab'));
    if (!tabs.length) return;

    // helper to get panel element for a tab
    function getPanelFor(tab) {
      let target = tab.getAttribute('data-target') || tab.getAttribute('aria-controls') || tab.getAttribute('href');
      if (!target) {
        // fallback: if tab id is "tab-mission" -> panel id "panel-mission"
        const tid = tab.id || '';
        if (tid) return document.getElementById(tid.replace(/^tab-/, 'panel-')) || null;
        return null;
      }
      // normalize
      if (target.startsWith('#')) target = target.slice(1);
      return document.getElementById(target) || null;
    }

    function showPanel(panel) {
      if (!panel) return;
      panel.classList.remove('hidden');
      panel.removeAttribute('aria-hidden');
      // ensure visible even if some other CSS set display
      panel.style.display = panel.style.display === 'none' ? '' : panel.style.display || '';
    }

    function hidePanel(panel) {
      if (!panel) return;
      panel.classList.add('hidden');
      panel.setAttribute('aria-hidden', 'true');
      // ensure hidden in case of CSS specificity issues
      panel.style.display = 'none';
    }

    function positionIndicator(activeTab) {
      if (!activeTab) {
        indicator.style.width = '0';
        return;
      }
      // compute left relative to container scroll
      const left = activeTab.offsetLeft - container.scrollLeft;
      indicator.style.left = left + 'px';
      indicator.style.width = activeTab.offsetWidth + 'px';
    }

    function activateTab(tab, updateHash = true) {
      if (!tab) return;
      tabs.forEach(t => {
        t.classList.remove('tab-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('tab-active');
      tab.setAttribute('aria-selected', 'true');

      // Hide all panels
      tabs.forEach(t => {
        const p = getPanelFor(t);
        if (p) hidePanel(p);
      });

      // Show selected panel
      const panel = getPanelFor(tab);
      if (panel) {
        showPanel(panel);
        // Update hash so deep-linking works
        if (updateHash && panel.id) {
          try { history.replaceState(null, '', '#' + panel.id); } catch(e) { /* ignore */ }
        }
      }

      positionIndicator(tab);
    }

    // Initialization
    tabs.forEach((t, i) => {
      // ARIA & tabindex fixes
      t.setAttribute('role', 'tab');
      if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '0');

      // Set aria-controls if missing (from href/data-target)
      if (!t.getAttribute('aria-controls')) {
        const tgt = t.getAttribute('data-target') || t.getAttribute('href');
        if (tgt) {
          t.setAttribute('aria-controls', tgt.startsWith('#') ? tgt.slice(1) : tgt);
        } else if (t.id) {
          t.setAttribute('aria-controls', t.id.replace(/^tab-/, 'panel-'));
        }
      }

      // Ensure panels have aria-hidden initially (if they have 'hidden' class it's fine)
      const p = getPanelFor(t);
      if (p) {
        if (p.classList.contains('hidden')) {
          p.setAttribute('aria-hidden', 'true');
          p.style.display = 'none';
        } else {
          p.removeAttribute('aria-hidden');
          p.style.display = p.style.display || '';
        }
      }

      // Click handler
      t.addEventListener('click', (ev) => {
        ev.preventDefault();
        activateTab(t, true);
      });

      // Keyboard handling
      t.addEventListener('keydown', (ev) => {
        const len = tabs.length;
        if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') {
          ev.preventDefault();
          tabs[(i + 1) % len].focus();
        } else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') {
          ev.preventDefault();
          tabs[(i - 1 + len) % len].focus();
        } else if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          activateTab(t, true);
        }
      });
    });

    // Activate from URL hash if there is a matching panel; else find first tab with aria-selected or tab-active class
    const hash = (window.location.hash || '').replace('#','');
    let initialTab = null;
    if (hash) {
      tabs.forEach(t => {
        const p = getPanelFor(t);
        if (p && p.id === hash) initialTab = t;
      });
    }
    if (!initialTab) initialTab = container.querySelector('.tab[aria-selected="true"]') || container.querySelector('.tab.tab-active') || tabs[0];

    // Activate initial tab and position indicator after a short timeout to allow layout
    setTimeout(() => {
      activateTab(initialTab, false);
    }, 30);

    // adjust on resize/scroll
    window.addEventListener('resize', () => positionIndicator(container.querySelector('.tab.tab-active') || container.querySelector('.tab[aria-selected="true"]')));
    container.addEventListener('scroll', () => positionIndicator(container.querySelector('.tab.tab-active') || container.querySelector('.tab[aria-selected="true"]')));
  });

  // If there is a legacy inline showTab function from template, override it to call our handler
  // (This prevents conflicts if someone clicks something that calls showTab('vision') etc.)
  window.showTab = function(key) {
    // try to find a tab with id tab-<key> or data-target=panel-<key>
    const tabById = document.getElementById('tab-' + key);
    if (tabById) { tabById.click(); return; }
    // find any tab that targets the panel id
    const selector = '.tabs.tabs-ppnc .tab';
    const tabs = document.querySelectorAll(selector);
    for (const t of tabs) {
      const p = t.getAttribute('data-target') || t.getAttribute('href') || t.getAttribute('aria-controls') || '';
      if (p.replace(/^#/, '') === ('panel-' + key) || p.replace(/^#/, '') === key) { t.click(); return; }
    }
  };
});
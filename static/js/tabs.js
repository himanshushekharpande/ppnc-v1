// tabs.js — minimal accessible tab switching
document.addEventListener('DOMContentLoaded', function () {
  const tabs = Array.from(document.querySelectorAll('[role="tablist"] .tab'));
  const indicatorParent = document.querySelector('[role="tablist"]');

  function activateTab(tab) {
    // deactivate all tabs/panels
    tabs.forEach(t => {
      t.setAttribute('aria-selected', 'false');
      t.classList.remove('tab-active');
      const panelId = t.getAttribute('data-target');
      const panel = document.getElementById(panelId);
      if (panel) {
        panel.classList.add('hidden');
        panel.setAttribute('aria-hidden', 'true');
      }
    });

    // activate chosen tab/panel
    tab.setAttribute('aria-selected', 'true');
    tab.classList.add('tab-active');
    const panel = document.getElementById(tab.getAttribute('data-target'));
    if (panel) {
      panel.classList.remove('hidden');
      panel.setAttribute('aria-hidden', 'false');
    }
    tab.focus();
  }

  tabs.forEach((t, idx) => {
    t.addEventListener('click', (e) => {
      activateTab(e.currentTarget);
    });
    t.addEventListener('keydown', (e) => {
      const key = e.key;
      let newIndex = idx;
      if (key === 'ArrowRight') newIndex = (idx + 1) % tabs.length;
      if (key === 'ArrowLeft') newIndex = (idx - 1 + tabs.length) % tabs.length;
      if (newIndex !== idx) {
        activateTab(tabs[newIndex]);
      }
      if (key === 'Home') activateTab(tabs[0]);
      if (key === 'End') activateTab(tabs[tabs.length - 1]);
    });
  });

  // ensure a default active tab exists
  const preselected = tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0];
  if (preselected) activateTab(preselected);
});

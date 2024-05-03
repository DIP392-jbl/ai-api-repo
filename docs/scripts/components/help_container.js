export function initRun() {
  bindOnClick('help_back', async () => { await loadComponent({
    containerId: 'content',
    html: support_html,
    css: support_css,
    init: support_init
  })
  // sessionStorage.setItem('content-view', 'support')
});
}
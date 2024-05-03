export function initRun() {
  bindElementOnClickFunction();
}

function bindElementOnClickFunction() {
  bindOnClick('guideLink', async () => {
    await loadComponent({
      containerId: 'content',
      html: guide_html,
      css: guide_css,
      init: guide_init
    });
  });

  bindOnClick('questionsLink', async () => {
    await loadComponent({
      containerId: 'content',
      html: support_html,
      css: support_css,
      init: support_init
    });
  });
}

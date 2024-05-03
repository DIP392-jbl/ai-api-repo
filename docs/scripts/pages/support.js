export function initRun() {
  makeHelpBoxTable()

  // Bind search functionality
  bindOnClick('do_search', performSearch);
  bindOnClick('search', performSearch, true);

  bindOnClick('contact_link', async () => { await loadComponent({
    containerId: 'content',
    html: contact_html,
    css: contact_css,
    init: contact_init
  })});
}

async function makeHelpBoxTable() {
  const categories = [
    { id: 'payment_help', title: 'Payment Help' },
    { id: 'plan_help', title: 'Plan Help' },
    { id: 'app_help', title: 'App Help' },
    { id: 'device_help', title: 'Device Help' },
    { id: 'safety_privacy', title: 'Safety & Privacy' },
    { id: 'account_help', title: 'Account Help' }
  ];

  const container = document.getElementById('support_categories');
  const response = await fetch(help_box);
  const templateHtml = await response.text();

  categories.forEach(category => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(templateHtml, 'text/html');
    const categoryElement = doc.querySelector('.category');
    categoryElement.id = category.id;
    categoryElement.querySelector('h3').textContent = category.title;
    container.appendChild(categoryElement);

    if (category.id != 'safety_privacy') {
      bindOnClick(category.id, async () => { await loadComponent({
        containerId: 'content',
        html: window[category.id + '_html'],
        css: help_container_css,
        init: help_container_init
      })});
    } else {
      bindOnClick(category.id, async () => { await loadComponent({
        containerId: 'content',
        html: window[category.id + '_html'],
        css: help_container_css,
        init: sidebarFollowContent
      })});
    }
  });
}

function performSearch() {
  const searchInput = document.getElementById('search').value;
  console.log('Searching for:', searchInput);
}

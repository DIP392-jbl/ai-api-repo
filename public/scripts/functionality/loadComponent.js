// Loads compontent and related functionality
export async function loadComponent({
  containerId, // Id of the container element in which to house the 'html'
  html, // Path to the HTML file to add
  css = [], // List or single CSS file to add (component is dependent on these)
  js = [], // List or single JS file to add (component is dependent on these)
  init // Path to the JS file with the initRun function that runs (for component setup)
}) {
  const container = document.getElementById(containerId);

  try {
    const existingState = JSON.parse(sessionStorage.getItem('pageState')) || {};
    existingState[containerId] = { html, css, js, init };
    sessionStorage.setItem('pageState', JSON.stringify(existingState));

    if (containerId === 'content') {
      // Extract the page name from the html path and save it as the current page
      const pageName = html.split('/').pop().split('.').shift();
      sessionStorage.setItem('content', pageName);
      updateView();
    }

    // Load CSS dependencies
    const cssFiles = Array.isArray(css) ? css : [css];
    const addedCssLinks = cssFiles.map(cssPath => {
      const link = document.createElement('link');
      link.href = cssPath.endsWith('.css') ? cssPath : `${cssPath}.css`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
      return link;
    });

    // Fetch and inject HTML content
    const response = await fetch(html.endsWith('.html') ? html : `${html}.html`);
    if (!response.ok) throw new Error(`Failed to fetch HTML from ${html}`);
    const htmlContent = await response.text();
    container.innerHTML = htmlContent;

    // Load JS dependencies
    const jsFiles = Array.isArray(js) ? js : [js];
    const addedJsScripts = jsFiles.map(jsPath => {
      const script = document.createElement('script');
      script.src = jsPath;
      script.type = 'module';
      document.head.appendChild(script);
      return script;
    });

    // Import the JavaScript module and call setup function
    if (init) {
      try {
        const initModule = await import(`${init}`);
        if (initModule && initModule.initRun) {
          initModule.initRun();
        }
      } catch (initError) {
        console.error(`Failed to load and execute initRun from ${init}:`, initError);
      }
    }

    // Mutation observer to detect significant DOM changes indicating component replacements
    let observer = new MutationObserver(mutations => {
      let isMajorChange = false; // Flag to detect significant DOM changes
    
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.removedNodes.length) {
          // Check if the removed nodes are significant enough to consider as a component change
          for (const node of mutation.removedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE && (node.tagName === 'DIV' || node.tagName === 'MAIN')) {
              isMajorChange = true; // A significant element was removed
              break;
            }
          }
        }
      
        if (isMajorChange) {
          // Clean up only if a major structural change has occurred
          addedCssLinks.forEach(link => document.head.removeChild(link));
          addedJsScripts.forEach(script => document.head.removeChild(script));
          observer.disconnect();
          break;
        }
      }
    });

    observer.observe(container, { childList: true, subtree: true });

  } catch (error) {
    console.error(`Failed at loadComponent() for ${containerId}: ${error}`);
  }
}

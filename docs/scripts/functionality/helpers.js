// Adds an on click and on enter key press function to an element found by ID
export function bindOnClick(id, handler, onlyOnEnter = false) {
  let element = document.getElementById(id);
  if (element) {
    const newElement = element.cloneNode(true); // Cloning to remove old event listeners
    element.parentNode.replaceChild(newElement, element);

    // Common function to handle both click and Enter key events
    const handleAction = (event) => {
      // Check if the event is a keydown and not Enter key, return without action
      if (event.type === 'keydown' && event.key !== "Enter") {
        return;
      }
      if (newElement.type !== 'checkbox') {
        event.preventDefault(); // Prevent default only if not a checkbox
      }
      handler();
    };

    // Attach event listeners
    newElement.addEventListener('keydown', handleAction);
    if (!onlyOnEnter) {
      newElement.addEventListener('click', handleAction);
    }
  } else {
    console.error(`Element with ID '${id}' not found.`);
  }
}

export function applyCustomStyle({elementId, customClass, newText}) {
  const element = document.getElementById(elementId);
  if (element) {
    // Store the original text if it hasn't been stored yet
    if (!element.dataset.originalText) {
      element.dataset.originalText = element.textContent;
    }

    // Remove any previous custom classes and apply the new custom class
    element.classList.forEach(cls => {
      if (cls.startsWith('custom-')) {
        element.classList.remove(cls);
      }
    });
    element.classList.add(customClass);

    // Update the element's text
    element.textContent = newText;
  } else {
    console.error("Element not found.");
  }
}

export function greatReset() {
  const email = localStorage.getItem('email');
  const password = localStorage.getItem('password');
  const rememberCredentials = document.getElementById('remember-credentials').checked;

  // Select elements to potentially reset
  const affectedElements = document.querySelectorAll('[data-original-text], [data-originalValue], .has-error, .has-success, .credentials-form input, .toggle-password, button');

  affectedElements.forEach(element => {
    // Re-enable all buttons regardless of other conditions
    if (element.tagName === 'BUTTON') {
      element.disabled = false;
    }

    // Skip resetting credentials fields if credentials are saved and checkbox is checked
    if (rememberCredentials && email && password && 
        (element.id === 'login-username' || element.id === 'login-password' || element.id === 'remember-credentials')) {
        // If credentials are saved, restore them
        if (element.id === 'login-username') {
            element.value = email;
        } else if (element.id === 'login-password') {
            element.value = password;
        } else if (element.id === 'remember-credentials') {
            element.checked = true;
        }
        return; // Skip further reset logic for these elements
    }

    // Reset classes that start with 'custom-'
    element.classList.forEach(cls => {
        if (cls.startsWith('custom-')) {
            element.classList.remove(cls);
        }
    });

    // Reset 'has-error' and 'has-success' classes
    if (element.classList.contains('has-error') || element.classList.contains('has-success')) {
        element.classList.remove('has-error', 'has-success');
    }

    // Clear any stored original values
    if (element.dataset.originalValue) {
        element.dataset.originalValue = ''; // Ensure no value is restored unexpectedly
    }

    // Restore original text if it was modified
    if (element.dataset.originalText) {
        element.textContent = element.dataset.originalText;
    }

    // Handle input-specific resets
    if (element.tagName === 'INPUT') {
        if (element.type === 'checkbox') {
            element.checked = false;
        } else {
            element.value = '';
            element.placeholder = element.dataset.originalPlaceholder || element.placeholder;
        }
    }

    // Handle toggle-password button specifics
    if (element.classList.contains('toggle-password')) {
        const container = element.closest('.password-container');
        const passwordInput = container.querySelector('.password-input');
        element.textContent = 'show';
        passwordInput.type = 'password';
    }
  });
}

export function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function updateView() {
  updateAuthLink();
  sessionStorage.removeItem('user_email');
}

export async function restoreState() {
  const savedState = JSON.parse(sessionStorage.getItem('pageState'));

  if (savedState) {
    for (const [containerId, componentInfo] of Object.entries(savedState)) {
      await loadComponent({
        containerId,
        html: componentInfo.html,
        css: componentInfo.css,
        js: componentInfo.js,
        init: componentInfo.init
      });
    }
  } else {
    // Load landing page (default components) if there's no saved state
    await loadComponent({
      containerId: 'header',
      html: header_html,
      css: header_css,
      init: header_init
    });
    await loadComponent({
      containerId: 'content',
      html: home_html,
      css: home_css,
      init: home_init
    });
    await loadComponent({
      containerId: 'footer',
      html: footer_html,
      css: footer_css,
      init: footer_init
    });
  }

  refreshUser();
}

export function initRun() {
  // Set header center logo image
  document.getElementById('logoLink').querySelector('img').src = logo_svg;
  bindElementOnClickFunction();
}

export function updateAuthLink() {
  let user = null;
  try {
    // Attempt to parse the user data from sessionStorage only if it exists
    const userData = sessionStorage.getItem('user');
    if (userData) {
      user = JSON.parse(userData);
    }
  } catch (error) {
    // If parsing fails, log the error (optional) and do nothing, allowing the code to proceed with user = null
    // console.error("Failed to parse user data:", error);
  }

  const authLink = document.getElementById('authLink');

  // Use user data if available and correctly parsed; otherwise default to 'LOGIN'
  if (user) {
    if (sessionStorage.getItem('content') === 'account') {
      // User is logged in and on the account page
      authLink.textContent = 'SIGN OUT';
      authLink.onclick = async () => {
        await unAuthenticate(); // Handle sign out
      };
    } else {
      // User is logged in but not on the account page
      authLink.textContent = 'ACCOUNT';
      authLink.onclick = async () => {
        await loadComponent({
          containerId: 'content',
          html: account_html,
          css: account_css,
          init: account_init
        });
      };
    }
  } else {
    // User data is not available or parsing failed, default to showing 'LOGIN'
    authLink.textContent = 'LOGIN';
    authLink.onclick = async () => {
      await loadComponent({
        containerId: 'content',
        html: logon_html,
        css: logon_css,
        js: logon_js,
        init: logon_init
      });
    };
  }
}

function bindElementOnClickFunction() {
  bindOnClick('homeLink', async () => {
    sessionStorage.setItem('content-view', 'home');
      await loadComponent({
        containerId: 'content',
        html: home_html,
        css: home_css,
        init: home_init
      });
  });

  bindOnClick('logoLink', async () => {
    sessionStorage.setItem('content-view', 'home');
      await loadComponent({
          containerId: 'content',
          html: home_html,
          css: home_css,
          init: home_init
      });
  });

  bindOnClick('authLink', () => sessionStorage.setItem('content-view', 'login'));
}

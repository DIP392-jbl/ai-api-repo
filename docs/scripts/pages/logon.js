export function initRun() {
  bindElementOnClickFunction();

  const email = localStorage.getItem('email');
  const password = localStorage.getItem('password');

  if (email && password) {
      document.getElementById('login-username').value = email;
      document.getElementById('login-password').value = password;
      document.getElementById('remember-credentials').checked = true;
  }
}

function bindElementOnClickFunction() {
  const loginForm = document.getElementById('login-section');
  const registerForm = document.getElementById('register-section');
  const passwordResetForm = document.getElementById('password-reset-section');

  // Function to set form visibility based on state
  const logonFormState = sessionStorage.getItem('content-view');
  if (logonFormState === 'register') {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    passwordResetForm.style.display = 'none';
  } else if (logonFormState === 'login') {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    passwordResetForm.style.display = 'none';
  } else {
    loginForm.style.display = 'none';
    registerForm.style.display = 'none';
    passwordResetForm.style.display = 'block';
  }

  bindOnClick('show-register-form', () => {
    registerForm.style.display = 'block';
    loginForm.style.display = 'none';
    passwordResetForm.style.display = 'none';
    sessionStorage.setItem('content-view', 'register');
    greatReset();
  });

  bindOnClick('show-login-form', () => {
    greatReset();
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
    passwordResetForm.style.display = 'none';
    sessionStorage.setItem('content-view', 'login');
  });

  bindOnClick('show-forgot-password-form', () => {
    greatReset();
    registerForm.style.display = 'none';
    loginForm.style.display = 'none';
    passwordResetForm.style.display = 'block';
    sessionStorage.setItem('content-view', 'forgot-password');
  });

  bindOnClick('back-to-login', () => {
    greatReset();
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
    passwordResetForm.style.display = 'none';
    sessionStorage.setItem('content-view', 'login');
  });

  // Login & Register validation logic
  bindOnClick('login-button', validateLoginForm);
  bindOnClick('register-button', validateRegisterForm);

  // Show-Hide password
  bindOnClick('login-show-hide', () => togglePasswordVisibility('login'));
  bindOnClick('register-show-hide', () => togglePasswordVisibility('register'));

  // Remember credentials checkbox handling
  bindOnClick('remember-credentials', () => {
    const rememberCheckbox = document.getElementById('remember-credentials');
    if (!rememberCheckbox.checked) {
      localStorage.removeItem('email');
      localStorage.removeItem('password');
    }
  });

  bindOnClick('send-reset-email', forgotPasswordForm);
}

async function forgotPasswordForm() {
  const loginForm = document.getElementById('login-section');
  const registerForm = document.getElementById('register-section');
  const passwordResetForm = document.getElementById('password-reset-section');
  const email = document.getElementById('reset-email').value.trim();

  // Validate email
  if (!email) {
    showError({
      containerId: 'password-reset-form',
      errorElementID: 'reset-email',
      errorMessage: 'cannot be empty'
    });
    return;
  } else if (!isValidEmail(email)) {
    showError({
      containerId: 'password-reset-form',
      errorElementID: 'reset-email',
      errorMessage: 'wrong email'
    });
    return;
  } if (!(await isEmailRegistered(email))) {
    showError({
      containerId: 'password-reset-form',
      errorElementID: 'reset-email',
      errorMessage: 'not registered'
    });

    applyCustomStyle({
      elementId: 'back-to-login',
      newText: 'Back to register'
    });
    
    bindOnClick('back-to-login', () => {
      greatReset();
      registerForm.style.display = 'block';
      loginForm.style.display = 'none';
      passwordResetForm.style.display = 'none';
      sessionStorage.setItem('content-view', 'register');
    });
  } else {
    applyCustomStyle({
      elementId: 'back-to-login',
      newText: 'Back to sign in'
    });

    bindOnClick('back-to-login', () => {
      greatReset();
      registerForm.style.display = 'none';
      loginForm.style.display = 'block';
      passwordResetForm.style.display = 'none';
      sessionStorage.setItem('content-view', 'login');
    });

    try {
      await sendResetPasswordEmail(email);
      showSuccess({
        containerId: 'password-reset-form',
        successElementID: 'send-reset-email',
        successMessage: 'Sent!',
        disableButton: true
      });
    } catch (error) {
      console.log("Failed to send reset email:", error);
    }
  }
}

function togglePasswordVisibility(containerSuffix) {
  const container = document.getElementById(containerSuffix + '-password-container');
  const passwordInput = container.querySelector('.password-input');
  const toggleButton = container.querySelector('.toggle-password');

  // This removes the error state when the button is clicked
  container.classList.remove('has-error');
  passwordInput.classList.remove('has-error');
  passwordInput.placeholder = passwordInput.dataset.originalPlaceholder;

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleButton.textContent = 'hide';
  } else {
    passwordInput.type = 'password';
    toggleButton.textContent = 'show';
  };

  passwordInput.focus();
}

async function validateLoginForm() {
  const usernameInput = document.getElementById('login-username');
  const passwordInput = document.getElementById('login-password');

  let isFormValid = true;

  if (!usernameInput.value.trim()) {
    showError({
      containerId: 'login-form',
      errorElementID: 'login-username',
      errorMessage: 'cannot be empty'
    });
    isFormValid = false;
  }

  if (passwordInput.value.length < 8) {
    showError({
      containerId: 'login-form',
      errorElementID: 'login-password',
      errorMessage: 'invalid'
    });
    isFormValid = false;
  }

  // Attempt to sign in
  if (isFormValid) {
    try {
      const result = await signIn(usernameInput.value.trim(), passwordInput.value);
  
      if (!result.success) {
        if (result.root === 'password') {
          showError({
            containerId: 'login-form',
            errorElementID: 'login-password',
            errorMessage: 'invalid password'
          });
        } else {
          showError({
            containerId: 'login-form',
            errorElementID: 'login-username',
            errorMessage: result.root + ' not found'
          });
        }
      } else {
        console.log("Login successful:", result.user.uid);
        if (document.getElementById('remember-credentials').checked) {
          localStorage.setItem('email', result.user.email);
          localStorage.setItem('password', passwordInput.value);
        } else {
          localStorage.removeItem('email');
          localStorage.removeItem('password');
        }
        await loadComponent({
          containerId: 'content',
          html: account_html,
          css: account_css,
          init: account_init
        });
      }
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  }
}

async function validateRegisterForm() {

  // Button element and its animation handling
  const registerButton = document.getElementById('register-button');
  const stopAnimation = animateButton(registerButton);

  // Get the input elements
  const usernameInput = document.getElementById('register-username');
  const emailInput = document.getElementById('register-email');
  const passwordInput = document.getElementById('register-password');
  const policeConsentCheckbox = document.getElementById('police-consent');

  let isFormValid = true;

  // Validate username
  if (!usernameInput.value.trim()) {
    showError({
      containerId: 'register-form',
      errorElementID: 'register-username',
      errorMessage: 'cannot be empty'
    });
    isFormValid = false;
  }

  // Validate email
  if (!emailInput.value.trim()) {
    showError({
      containerId: 'register-form',
      errorElementID: 'register-email',
      errorMessage: 'cannot be empty'
    });
    isFormValid = false;
  } else if (!isValidEmail(emailInput.value.trim())) {
    showError({
      containerId: 'register-form',
      errorElementID: 'register-email',
      errorMessage: 'wrong email'
    });
    isFormValid = false;
  }

  // Validate password
  if (passwordInput.value.length < 8) {
    showError({
      containerId: 'register-form',
      errorElementID: 'register-password',
      errorMessage: 'min 8 characters'
    });
    isFormValid = false;
  }

  // Validate police consent checkbox
  if (!policeConsentCheckbox.checked) {
    showError({
      containerId: 'register-form',
      errorElementID: 'police-consent',
    });
    isFormValid = false;
  }

  // If the form is valid, proceed with the registration
  if (isFormValid) {
    const result = await registerUser(emailInput.value, usernameInput.value, passwordInput.value)
      .catch(error => {
        console.error("Error during registration:", error);
        return { success: false, message: error.message || "Unknown error occurred" };
      });

    stopAnimation();  // Stop the button animation

    if (result && result.success) {
      console.log("User registration successful.");

      showSuccess({
        containerId: 'register-form',
        successElementID: 'register-button',
        successMessage: 'Success!'
      });

      setTimeout(() => {
        applyCustomStyle({
          elementId: 'register-button',
          customClass: 'custom-welcome',
          newText: 'Login'
        });

        bindOnClick('register-button', async () => {
          const result = await signIn(emailInput.value, passwordInput.value);
          await loadComponent({
            containerId: 'content',
            html: account_html,
            css: account_css,
            init: account_init
          });
        });
      }, 1234);
    } else if (result.message == 'Username is already in use.') {
      showError({
        containerId: 'register-form',
        errorElementID: 'register-username',
        errorMessage: 'already in use'
      });
    } else if (result.message == 'Firebase: Error (auth/email-already-in-use).') {
      showError({
        containerId: 'register-form',
        errorElementID: 'register-email',
        errorMessage: 'already in use'
      });
    } else  {
      console.log(`Failed to register user: ${result ? result.message : "Unknown error"}`);
    }
  } else {
    stopAnimation();  // Ensure animation stops if form is invalid
  }
}

function animateButton(button) {
  let count = 0;
  const originalText = button.innerHTML;
  button.disabled = true;

  const intervalId = setInterval(() => {
    count = (count + 1) % 4;
    button.innerHTML = originalText + 'ing' + '.'.repeat(count);
  }, 500);

  return () => {
    clearInterval(intervalId);
    button.innerHTML = originalText;
    button.disabled = false;
  };
}

export function initRun() {
  bindOnClick('help_back', async () => {
    await loadComponent({
      containerId: 'content',
      html: support_html,
      css: support_css,
      init: support_init
    });
    sessionStorage.setItem('content-view', 'contact-form');
  });

  userEmail();

  bindOnClick('contact-form-submit', sendForm);
}

function sendForm() {
  const message = document.getElementById('contact-form-input').value;
  if (!message) {
    showError({
      containerId: 'contact',
      errorElementID: 'contact-form-submit',
      errorMessage: 'Cannot be empty'
    });
  } else {
    console.log(message);
  }
}

function userEmail() {
  // First, try to retrieve the full user object possibly stored by your authentication mechanism
  const fullUser = JSON.parse(sessionStorage.getItem('user'));  // Assuming 'user' is the key for authenticated user data
  const tempUser = JSON.parse(sessionStorage.getItem('user_email'));  // Temporary email stored for the page
  
  let email;
  
  if (fullUser && fullUser.email) {
    email = fullUser.email;  // Use email from the authenticated user's data
  } else if (tempUser && tempUser.email) {
    email = tempUser.email;  // Fallback to the temporary email for the page
  }

  const contactForm = document.getElementById('contact-form');
  const emailForm = document.getElementById('email-request-container');
  
  if (email) {
    contactForm.style.display = 'grid';
    emailForm.style.display = 'none';
  } else {
    contactForm.style.display = 'none';
    emailForm.style.display = 'block';
    bindOnClick('email-request-button', verifyEmailOK);  // Ensure email request button is active for email entry
  }
}

function verifyEmailOK() {
  const emailInput = document.getElementById('email-request').value.trim();
  var isValid = true;

  if (!emailInput) {
    showError({
      containerId: 'contact',
      errorElementID: 'email-request',
      errorMessage: 'cannot be empty'
    });
    isValid = false;
  } else if (!isValidEmail(emailInput)) {
    showError({
      containerId: 'contact',
      errorElementID: 'email-request',
      errorMessage: 'invalid email'
    });
    isValid = false;
  }

  if (isValid) {
    sessionStorage.setItem('user_email', JSON.stringify({email: emailInput})); // Store validated email as part of the user object
    userEmail(); // Re-evaluate user email presence
  }
}

export function initRun() {
  updateUserDisplay();
}

function updateUserDisplay() {
  const user = JSON.parse(sessionStorage.getItem('user'));
  if (user) {
    document.getElementById('account-username').querySelector('span').textContent = user.displayName || 'User';
    document.getElementById('account-email').querySelector('span').textContent = user.email;
    document.getElementById('email-verified').querySelector('span').textContent = user.emailVerified ? 'Yes' : 'No';

    const resendVerificationBtn = document.getElementById('resendVerificationBtn');
    resendVerificationBtn.addEventListener('click', () => resendEmailVerification());

    const deleteButton = document.getElementById('deleteAccountBtn');
    deleteButton.addEventListener('click', () => deleteUserAccount());

    if (user.emailVerified) {
      performVerifiedUserActions();
    } else {
      performUnverifiedUserActions();
    }
  }
}

function performVerifiedUserActions() {
  console.log('Performing actions for verified users.');
  // Implement actions for verified users
}

function performUnverifiedUserActions() {
  console.log('Actions for users who need to verify their email.');
  // Implement actions for unverified users, like showing reminders or additional prompts
}
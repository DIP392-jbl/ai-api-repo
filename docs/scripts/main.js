// Project requires?:
// npm install dotenv
// npm install firebase
// npm install vite
// npm install openai

// Header
window.header_html = '/public/views/components/header.html';
window.header_css = '/public/styling/components/header.css';
window.header_init = '/public/scripts/components/header.js';

// Footer
window.footer_html = '/public/views/components/footer.html';
window.footer_css = '/public/styling/components/footer.css';
window.footer_init = '/public/scripts/components/footer.js';

// Landing page
window.home_html = '/public/views/pages/home.html';
window.home_css = '/public/styling/pages/home.css';
window.home_init = '/public/scripts/pages/home.js';

// Logon page
window.logon_html = '/public/views/pages/logon.html';
window.logon_css = '/public/styling/pages/logon.css';
window.logon_js = '/public/scripts/functionality/authorization.js';
window.logon_init = '/public/scripts/pages/logon.js';

// Guide page
window.guide_html = '/public/views/pages/guide.html';
window.guide_css = '/public/styling/pages/guide.css';
window.guide_init = '/public/scripts/pages/guide.js';

// support page
window.support_html = '/public/views/pages/support.html';
window.support_css = '/public/styling/pages/support.css';
window.support_init = '/public/scripts/pages/support.js';

// Account page
window.account_html = '/public/views/pages/account.html';
window.account_css = '/public/styling/pages/account.css';
window.account_init = '/public/scripts/pages/account.js';

// Support page help category compontent
window.help_box = '/public/views/components/help_category.html';

// Functionality for sidebar
window.sidebarFollowContent = '/public/scripts/functionality/sidebarFollowContent.js';

// Support FAQs
window.payment_help_html = '/public/views/components/support/faqs/payment_help.html';
window.plan_help_html = '/public/views/components/support/faqs/plan_help.html';
window.app_help_html = '/public/views/components/support/faqs/app_help.html';
window.device_help_html = '/public/views/components/support/faqs/device_help.html';
window.safety_privacy_html = '/public/views/components/support/faqs/safety_privacy.html';
window.account_help_html = '/public/views/components/support/faqs/account_help.html';
window.help_container_css = '/public/styling/components/help_container.css';
window.help_container_init = '/public/scripts/components/help_container.js';

// Contact form
window.contact_html = '/public/views/pages/contact.html';
window.contact_css = '/public/styling/pages/contact.css';
window.contact_init = '/public/scripts/pages/contact.js';

// Media
window.logo_svg = '/media/svg/logo.svg';

// Import functions
import { loadComponent } from '/public/scripts/functionality/loadComponent.js';
window.loadComponent = loadComponent;

import { bindOnClick, applyCustomStyle, greatReset, isValidEmail, updateView, restoreState }
from '/public/scripts/functionality/helpers.js';
window.bindOnClick = bindOnClick;
window.applyCustomStyle = applyCustomStyle;
window.greatReset = greatReset;
window.isValidEmail = isValidEmail;
window.updateView = updateView;
window.restoreState = restoreState;

import { showError, showSuccess } from '/public/scripts/functionality/validations.js';
window.showError = showError;
window.showSuccess = showSuccess;

import { registerUser, signIn, unAuthenticate, deleteUserAccount, refreshUser, sendVerificationEmail,
  resendEmailVerification, isEmailRegistered, sendResetPasswordEmail, saveStory, fetchStories }
from '/public/scripts/functionality/authorization.js'; // many functions, as it houses all firebase related stuff
window.registerUser = registerUser;
window.signIn = signIn;
window.unAuthenticate = unAuthenticate;
window.deleteUserAccount = deleteUserAccount;
window.refreshUser = refreshUser;
window.sendVerificationEmail = sendVerificationEmail;
window.resendEmailVerification = resendEmailVerification;
window.isEmailRegistered = isEmailRegistered;
window.sendResetPasswordEmail = sendResetPasswordEmail;
window.saveStory = saveStory;
window.fetchStories = fetchStories;

import { createStory } from '/public/scripts/functionality/chatGPT.js';
window.createStory = createStory;

import { updateAuthLink } from '/public/scripts/components/header.js';
window.updateAuthLink = updateAuthLink;

restoreState(); // Session managment - initialization

/*

TODO:
Contact form to admin view to send reply -> admin account view
payment stripe api
~ back functionality - "breadcrumbs" (6ish previous views)
Pritty emails
~ account history stuff
lightgray to white when hover/focus
accessibility
phone tablet and other screen sizes
normal scroll bar - like on macs

single page application angular
private and public separation (safety)
general overhaul - clean and documentation
*/
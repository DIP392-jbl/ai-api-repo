export function showError({containerId, errorElementID, errorMessage}) {
  const container = document.getElementById(containerId);
  if (container) {
    const errorElementContainer = container.querySelector(`#${errorElementID}-container`);
    const errorElement = errorElementContainer.querySelector(`#${errorElementID}`);
    if (errorElement) {
      // Proceed only if error class is not already applied
      if (!errorElementContainer.classList.contains('has-error')) {
        if (errorElement.tagName.toLowerCase() === 'button') {
          // Store original text if not already stored
          if (!errorElement.dataset.originalValue) {
            errorElement.dataset.originalValue = errorElement.textContent;
          }

          // Set error message as button text
          errorElement.textContent = errorMessage;

          // Define reset function to restore original text and remove error class
          const resetError = () => {
            if (errorElement.textContent === errorMessage) { // Check if error message is still displayed
              errorElement.textContent = errorElement.dataset.originalValue; // Restore original button text
            }
            errorElementContainer.classList.remove('has-error');
          };

          // Apply reset function on focus of button
          errorElement.addEventListener('focus', resetError, {once: true});

          // Apply reset function on focus of associated textarea
          const relatedTextarea = container.querySelector('textarea');
          if (relatedTextarea) {
            relatedTextarea.addEventListener('focus', resetError, {once: true});
          }
        } else {
          if (!errorElementContainer.querySelector('input[type="checkbox"]')) {
            // Input field elements!
            // Store original values if not already stored
            // errorElement.dataset.originalPlaceholder = errorElement.placeholder;
            errorElement.dataset.originalValue = errorElement.value;
  
            // Set error message in placeholder and clear the input value temporarily
            errorElement.placeholder = errorMessage;
            errorElement.value = ''; // Clear current input
            
            // Remove error class on focus and restore original values
            errorElement.addEventListener('focus', function() {
              errorElementContainer.classList.remove('has-error');
              this.placeholder = this.dataset.originalPlaceholder; // Restore the original placeholder
              if (!this.value) {
                this.value = this.dataset.originalValue; // Restore the original value only if no new input has been entered
              }
            }, {once: true});
          } else {
            // Checkbox elements!
            errorElement.addEventListener('change', function() {
              if (this.checked) {
                errorElementContainer.classList.remove('has-error');
                // Remove any error message or revert any error styling specific to checkboxes
                // ...
              }
            });
          }
        }
        
        errorElementContainer.classList.add('has-error');
      }
    } else {
      console.error("Error element not found within specified container.");
    }
  } else {
    console.error("Container not found.");
  }
}

export function showSuccess({containerId, successElementID, successMessage, disableButton = false}) {
  const container = document.getElementById(containerId);
  const successElement = document.getElementById(successElementID);
  
  if (container && successElement) {
    // Change to success message and style
    const originalText = successElement.textContent;
    successElement.textContent = successMessage;
    successElement.classList.add('has-success');
    
    if (disableButton) {
      successElement.disabled = true;  // Optionally disable the button
    }

    // Add event listeners to revert on interaction with other elements
    const inputsAndButtons = container.querySelectorAll('input, button');
    inputsAndButtons.forEach(element => {
      if (element !== successElement) { // Exclude the success element itself
        element.addEventListener('focus', () => revertSuccess(successElement, originalText, disableButton));
        element.addEventListener('click', () => revertSuccess(successElement, originalText, disableButton));
      }
    });

    // Also add keydown to handle keyboard navigation
    container.addEventListener('keydown', (event) => {
      if (event.key === "Tab") {
        revertSuccess(successElement, originalText);
      }
    });
  } else {
    console.error("showSuccess: Required elements not found.");
  }
}

function revertSuccess(element, originalText, disableButton) {
  if (element.classList.contains('has-success')) {
    element.textContent = originalText;
    element.classList.remove('has-success');
    if (disableButton) {
      element.disabled = false;  // Re-enable the button if it was disabled
    }
  }
}

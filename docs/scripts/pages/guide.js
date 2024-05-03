export function initRun() {  
  document.querySelectorAll('.dropdownable').forEach(button => {
    button.addEventListener('click', function() {
      const dropdownable = this.closest('.dropdownable');
      const content = dropdownable.nextElementSibling;  // Ensure it targets .guide-content

      if (dropdownable.classList.contains('expanded')) {
        dropdownable.classList.remove('expanded');
        content.style.maxHeight = null;  // Reset max-height
      } else {
        dropdownable.classList.add('expanded');
        // Set max-height to the scrollHeight + a little extra space
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });
}
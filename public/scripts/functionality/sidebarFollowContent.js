export function initRun() {
  // TODO : klunky chunky needs to be better, doesnt work well, needs a different approach

  console.log(66666666666);
  const headerHeight = 120; // Height of the header

  // Setup the observer with root as the viewport and rootMargin to offset by the header height
  const options = {
    root: null, // viewport
    rootMargin: `-${headerHeight}px 0px 0px 0px`, // Trigger 120px from the top of the viewport
    threshold: [0] // Trigger when the top of the section passes the threshold
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const link = document.querySelector(`.left-sidebar a[href="#${id}"]`);

      // Toggle active link based on whether the top of the element is just passing the header
      if (entry.boundingClientRect.top <= headerHeight) {
        updateActiveLink(link);
      }
    });
  }, options);

  // Observe all headers that have corresponding sidebar links
  document.querySelectorAll('h1[id], h2[id]').forEach(section => {
    observer.observe(section);
  });

  // Attach click events to sidebar links for manual activation
  document.querySelectorAll('.left-sidebar a').forEach(link => {
    link.addEventListener('click', function() {
      updateActiveLink(link);
    });
  });

  // Function to update active link, removing from others and adding to the clicked or observed one
  function updateActiveLink(activeLink) {
    document.querySelectorAll('.left-sidebar a').forEach(a => {
      a.classList.remove('active-link');
    });
    activeLink.classList.add('active-link');
  }
}

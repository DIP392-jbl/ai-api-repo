export async function initRun() {
  const contentView = sessionStorage.getItem('content-view') || 'home';
  const user = JSON.parse(sessionStorage.getItem('user'));

  console.log(2222222222);

  if (!user) {
    document.getElementById('product').style.display = "none";
    document.getElementById('home-text').style.display = "block";
    return;
  }

  document.getElementById('home-text').style.display = "none";
  document.getElementsByClassName("home-container")[0].style.maxWidth = "600px";

  const stories = await fetchStories(user.uid);
  updateSidebar(stories);

  bindOnClick('story-submit', storyMaker);
  bindOnClick('new-story', backToProductView);

  if (contentView === 'story') {
    const storyId = sessionStorage.getItem('current-story-id');
    if (storyId) {
      const story = stories.find(story => story.id === storyId);
      if (story) {
        displayStory(story);
      } else {
        backToProductView(); // Fallback to product view if story not found
      }
    }
  } else {
    backToProductView(); // Default to home/product view if contentView not set or 'home'
  }
}

async function storyMaker() {
  const titleInput = document.getElementById('title').value;
  const themeInput = document.getElementById('theme').value;
  const charactersInput = document.getElementById('characters').value;
  const descriptionInput = document.getElementById('description').value;
  
  if (!themeInput && !charactersInput && !descriptionInput) {
    showError({
      containerId: 'product',
      errorElementID: 'story-submit',
      errorMessage: 'cannot be empty!'
    });
  } else {
    // Button element and its animation handling
    const storySubmitButton = document.getElementById('story-submit');
    const stopAnimation = animateButton(storySubmitButton);

    const story = await createStory(titleInput, themeInput, charactersInput, descriptionInput);
    console.log(story);
    if (story) {
      sessionStorage.setItem('content-view', 'story');
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (user && user.uid) {
        await saveStory(user.uid, story);
        updateSidebar(await fetchStories(user.uid));  // Ensure the sidebar is updated with the new story
        displayStory(story);  // Display the new story immediately
      } else {
        console.error("No user session found, unable to save story.");
      }
    }

    // todo 
    stopAnimation();  // Stop the button animation
  }
}

function updateSidebar(stories) {
  const listElement = document.getElementById('story-list');
  listElement.innerHTML = ''; // Clear existing entries
  stories.forEach(story => {
    const storyLink = document.createElement('a');
    storyLink.href = '#';
    storyLink.textContent = story.title;
    storyLink.dataset.id = story.id; // Store id in data attribute
    storyLink.onclick = () => {
      sessionStorage.setItem('content-view', 'story');
      sessionStorage.setItem('current-story-id', story.id); // Save the story ID
      displayStory(story);
    };
    listElement.appendChild(storyLink);
  });
}

function backToProductView() {
  sessionStorage.setItem('content-view', 'home');
  document.getElementById('product').style.display = 'block';
  document.getElementById('story-view-container').style.display = 'none';
}

function displayStory(story) {
  document.getElementById('product').style.display = 'none';
  document.getElementById('story-view-container').style.display = 'block';
  document.getElementById('story-title').textContent = story.title;
  document.getElementById('story-content').textContent = story.content;
  console.log(`Title: ${story.title}`, `Content: ${story.content}`);
}

function animateButton(button) {
  let count = 0;
  const originalText = button.innerHTML;
  button.disabled = true;

  const intervalId = setInterval(() => {
    count = (count + 1) % 4;
    button.innerHTML = 'working' + '.'.repeat(count);
  }, 500);

  return () => {
    clearInterval(intervalId);
    button.innerHTML = originalText;
    button.disabled = false;
  };
}
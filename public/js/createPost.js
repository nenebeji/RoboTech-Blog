const newFormHandler = async (event) => {
    event.preventDefault();
  
    const title = document.querySelector('#post-title').value.trim();
    const post_content = document.querySelector('.post-content').value.trim();
    
    if (title && post_content) {
      const response = await fetch(`/api/posts`, {
        method: 'POST',
        body: JSON.stringify({ title, post_content }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        document.location.replace('/user-dashboard');
      } else {
        alert('Failed to create post');
      }
    }
};

// create post handler for dashboard
async function createPostHandler(event) {
    event.preventDefault();

    document.location.replace('/user-dashboard/new')
}



document.querySelector('.new-post-form').addEventListener('submit', newFormHandler);

document.querySelector('#create-new-post').addEventListener('click', createPostHandler);
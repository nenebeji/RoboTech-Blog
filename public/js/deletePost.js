const delButtonHandler = async (event) => {
    if (event.target.hasAttribute('data-id')) {
      const id = event.target.getAttribute('data-id');
  
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        document.location.replace('/user-dashboard');
      } else {
        alert('Failed to delete post');
      }
    }
};

document.querySelector('.delete-btn').addEventListener('click', delButtonHandler);
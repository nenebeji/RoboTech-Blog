// create post handler for dashboard
async function createPostHandler(event) {
    event.preventDefault();

    document.location.replace('/dashboard/create')
}

document.querySelector('#create-new-post').addEventListener('click', createPostHandler);
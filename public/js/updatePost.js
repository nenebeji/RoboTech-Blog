
const updateFormHandler = async (event) => {
    event.preventDefault();

    const title = document.querySelector('#post-title').value.trim();
    const post_content = document.querySelector('.post-content').value.trim();

    if(title && post_content){
        const response = await fetch(`/api/posts/${post_id}`, {
            method: 'PUT',
            body: JSON.stringify({
                title,
                post_content
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    
        if (response.ok) {
            document.location.replace('/user-dashboard');
        } else {
            alert(response.statusText);
        }
    }

}

document.querySelector('.edit-form').addEventListener('submit', updateFormHandler);
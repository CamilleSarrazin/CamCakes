// Replace with your Instagram Access Token
const accessToken = 'IGQWRQVWZAjcUR2LWVaTktJOGpkcnJNczJIMDNGNkpYTC1Ca054bERKd0VybUdyYlVrdm84aUJFX2p5eHRnQWRLbXVXcGhlZAWFISVg0M21MMnFxWHhLQXhRXzcxcFl3VE1sYXNNRDNJODd0UjcyVGVkanlLaG4tS2cZD';

// Function to fetch and display Instagram feed
function getInstagramFeed() {
    fetch(`https://graph.instagram.com/v12.0/me/media?fields=id,caption,media_type,media_url,permalink,timestamp&access_token=${accessToken}`)
        .then(response => response.json())
        .then(data => {
            const feedContainer = document.getElementById('photo-container');

            data.data.forEach(post => {
                const article = document.createElement('article');
                const span = document.createElement('span');
                span.classList.add("image");

                const postImage = document.createElement('img');
                postImage.src = post.media_url;
                postImage.alt = post.caption;
                span.appendChild(postImage);
                article.appendChild(span);


                const postLink = document.createElement('a');
                postLink.href = post.permalink;
                postLink.target = '_blank';
                
                const content = document.createElement('div');
                content.classList.add("content");
                
                const description = document.createElement('p');
                description.textContent = post.caption;

                content.appendChild(description);
                postLink.appendChild(content);
                article.appendChild(postLink);
                feedContainer.appendChild(article);
            });
        })
        .catch(error => console.error(error));
}

// Call the function to fetch and display the Instagram feed
getInstagramFeed();
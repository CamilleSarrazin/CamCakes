function getInstagramFeed() {
    fetch(`./insta`)
        .then(response => response.json())
        .then(data => {
            const feedContainer = document.getElementById('photo-container');

            data.forEach(post => {
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

getInstagramFeed();
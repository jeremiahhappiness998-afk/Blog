// Helper to get URL parameter
function getParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Load and display posts on index.html
if (document.getElementById('post-list')) {
    fetch('/posts.json')
        .then(res => res.json())
        .then(posts => {
            const container = document.getElementById('post-list');
            container.innerHTML = posts.map(post => `
                <div class="col-12">
                    <div class="post-card">
                        ${post.image ? `<img src="${post.image}" class="img-fluid mb-3" alt="${post.title}">` : ''}
                        <h2><a href="post.html?slug=${post.slug}" class="text-decoration-none text-dark">${post.title}</a></h2>
                        <div class="post-meta">${post.date ? new Date(post.date).toLocaleDateString() : ''}</div>
                        <p>${post.description}</p>
                        <a href="post.html?slug=${post.slug}" class="btn btn-outline-secondary btn-sm">Read more</a>
                    </div>
                </div>
            `).join('');
        });
}

// Load individual post on post.html
if (document.getElementById('post-content')) {
    const slug = getParam('slug');
    if (!slug) {
        document.getElementById('post-content').innerHTML = '<p>Post not found.</p>';
    } else {
        // Fetch the markdown file
        fetch(`/posts/${slug}.md`)
            .then(res => {
                if (!res.ok) throw new Error('Post not found');
                return res.text();
            })
            .then(markdown => {
                // Parse front matter (using front-matter library)
                const { attributes, body } = frontMatter(markdown);
                const html = marked.parse(body);
                document.getElementById('post-content').innerHTML = `
                    <h1>${attributes.title}</h1>
                    <div class="post-meta">${attributes.date ? new Date(attributes.date).toLocaleDateString() : ''}</div>
                    ${attributes.image ? `<img src="${attributes.image}" class="img-fluid my-3">` : ''}
                    <div class="post-body">${html}</div>
                    <a href="index.html" class="btn btn-outline-primary mt-4">← Back to Home</a>
                `;
            })
            .catch(err => {
                document.getElementById('post-content').innerHTML = '<p>Post not found.</p>';
            });
    }
}
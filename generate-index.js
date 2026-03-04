const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDir = path.join(__dirname, 'posts');
const outputFile = path.join(__dirname, 'posts.json');

const posts = fs.readdirSync(postsDir)
    .filter(file => file.endsWith('.md'))
    .map(file => {
        const raw = fs.readFileSync(path.join(postsDir, file), 'utf8');
        const { data, content } = matter(raw);
        // Extract first ~200 characters as excerpt (no HTML)
        const excerpt = content.slice(0, 200).replace(/#/g, '').trim() + '…';
        return {
            slug: file.replace('.md', ''),
            title: data.title || 'Untitled',
            date: data.date || null,
            image: data.image || null,
            description: data.description || excerpt,
        };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // newest first

fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2));
console.log(`✅ Generated posts.json with ${posts.length} entries.`);
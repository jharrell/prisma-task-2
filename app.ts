import express from 'express';

import prisma from './prisma';

const app = express();
app.use(express.json())

const PORT = process.env.port || 3000;

// USERS
app.get('/users', async (_, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

// POSTS
app.get('/posts', async (_, res) => {
    const posts = await prisma.post.findMany({
        include: {
            tags: true,
        }
    });
    res.json(posts);
});

app.get('/posts/:id', async (req, res) => {
    const { id }: { id?: string } = req.params;

    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
      include: {
        tags: true,
      }
    });
    res.json(post);
});

app.post('/posts', async (req, res) => {
    const { title, content, authorEmail } = req.body;
    const result = await prisma.post.create({
        data: {
            title,
            content,
            author: { connect: { email: authorEmail } },
        },
    });
    res.json(result);
});

// PAGES
app.get('/pages', async (req, res) => {
    const pages = await prisma.page.findMany({
        include: {
            tags: true
        },
    });
    res.json(pages);
})

app.get('/pages/:id', async (req, res) => {
    const { id }: { id?: string } = req.params;

    const page = await prisma.page.findUnique({
      where: { id: Number(id) },
      include: {
        tags: true,
      }
    });
    res.json(page);
})

app.post('/pages', async (req, res) => {
    const { title, authorEmail } = req.body;
    const result = await prisma.page.create({
        data: {
            title,
            author: { connect: { email: authorEmail } },
        },
    });
    res.json(result);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

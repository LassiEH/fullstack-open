const blogsRouter = require('express').Router()
const { request, response } = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
    const body = request.body
    const user = request.user

    const blog = new Blog({
        user: user,
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes ?? 0
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
    
    const blog = await Blog.findById(request.params.id)
    const user = request.user

    if (blog.user.toString() !== user.id) {
        return response.status(403).json({ error: 'invalid credentials' })        
    }
    if (!blog) {
        return response.status(404).json({ error: 'invalid blog' })        
    }

    try {
        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } catch (error) {
        response.status(400)
    }
})

blogsRouter.put('/:id', async (request, response) => {
    const blogInfo = request.body

    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        blogInfo,
        { new: true }
    )

    response.json(updatedBlog)
})

module.exports = blogsRouter
const blogsRouter = require('express').Router()
const { request, response } = require('../app')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes ?? 0
    })

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    const id = request.params.id
    try {
        await Blog.findByIdAndDelete(id)
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
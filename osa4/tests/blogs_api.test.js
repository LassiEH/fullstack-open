const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const assert = require('node:assert')
const testHelper = require('./test_helper')
const api = supertest(app)


beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(testHelper.initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(testHelper.initialBlogs[1])
    await blogObject.save()
})

describe('test get endpoint', () => {

    test('get correct number of blogs as JSON', async () => {
        const response = await api
            .get('/api/blogs/')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        assert.strictEqual(response.body.length, testHelper.initialBlogs.length)
    })

    test('get correct id field', async () => {
        const response = await api.get('/api/blogs/')

        response.body.forEach((blog) => {
            assert.ok(blog.id)
            assert.strictEqual(blog._id, undefined)
        })
    })

})

describe('test post endpoint', () => {

    test('add blog', async () => {
        const newBlog = {
            title: 'Blog post',
            author: 'Blog Poster',
            url: 'https://jyu.local/blogs',
            likes: 1,
        }

        await api
            .post('/api/blogs/')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsInDatabase = await testHelper.blogsInDb()
        assert.strictEqual(blogsInDatabase.length, testHelper.initialBlogs.length + 1)
    })

    test('add blog without likes', async () => {
        const newBlog = {
            title: 'Blog post',
            author: 'Blog Poster',
            url: 'https://jyu.local/blogs',
        }

        const response = await api
            .post('/api/blogs/')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsInDatabase = await testHelper.blogsInDb()
        const createdBlog = blogsInDatabase.find((b) => b.id === response.body.id)
        assert.strictEqual(createdBlog.likes, 0)
    })

    test('add blog without title', async () => {
        const newBlog = {
            author: 'Blog Poster',
            url: 'https://jyu.local/blogs',
            likes: 1,
        }

        await api
            .post('/api/blogs/')
            .send(newBlog)
            .expect(400)
    })

    test('add blog without url', async () => {
        const newBlog = {
            title: 'Blog post',
            author: 'Blog Poster',
            likes: 1,
        }

        await api
            .post('/api/blogs/')
            .send(newBlog)
            .expect(400)
    })

})

describe('test delete endpoint', () => {

    test('delete blog', async () => {
        const blogsInDatabase = await testHelper.blogsInDb()
        const blogToDelete = blogsInDatabase[0]
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)
        
        const blogsAfterDeleteDatabase = await testHelper.blogsInDb()
        assert.strictEqual(blogsAfterDeleteDatabase.length, testHelper.initialBlogs.length -1)
    })

    test('delete non existent blog', async () => {
        nonExistentId = new mongoose.Types.ObjectId
        await api
            .delete(`/api/blogs/${nonExistentId}`)
            .expect(204)
    })

})

describe('test update endpoint', () => {

    test('updates a blogs likes', async () => {
        const blogsInDatabase = await testHelper.blogsInDb()
        const blogToUpdate = blogsInDatabase[1]

        const updatedData = {
            ...blogToUpdate,
            likes: blogToUpdate.likes + 1
        }

        const response = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedData)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
    })

    test('updates a blogs url', async () => {
        const blogsInDatabase = await testHelper.blogsInDb()
        const blogToUpdate = blogsInDatabase[1]

        const updatedData = {
            ...blogToUpdate,
            url: blogToUpdate.url + '/blogs'
        }

        const response = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedData)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.url, blogToUpdate.url + '/blogs')
    })

    test('updates a blogs author', async () => {
        const blogsInDatabase = await testHelper.blogsInDb()
        const blogToUpdate = blogsInDatabase[1]

        const updatedData = {
            ...blogToUpdate,
            author: blogToUpdate.author + ' Extra Name'
        }

        const response = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedData)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.author, blogToUpdate.author + ' Extra Name')
    })

    test('updates a blogs title', async () => {
        const blogsInDatabase = await testHelper.blogsInDb()
        const blogToUpdate = blogsInDatabase[1]

        const updatedData = {
            ...blogToUpdate,
            title: blogToUpdate.title + ' Title'
        }

        const response = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedData)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.title, blogToUpdate.title + ' Title')
    })

})



after(async () => {
    await mongoose.connection.close()
})
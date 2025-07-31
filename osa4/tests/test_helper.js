const Blog = require('../models/blog')

const initialBlogs = [
    {
      title: 'Go To',
      author: 'Edgar Hoover',
      url: 'http://go.to',
      likes: 2,
    },
    {
      title: 'Harmful',
      author: 'Daniel Keyes',
      url: 'http://www.u.arizona.edu/harmful',
      likes: 5,
    }
  ]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs, blogsInDb
}
import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Loginform from './components/Loginform'
import Blogform from './components/Blogform'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }  
  }, [])

  const handleNotification = (message) => {
    setNotification({ message })
    setTimeout(() => {
      setNotification(null)
    }, 4000)
  }

  const handleError = (error) => {
    if (error.response.data.error) {
      handleNotification(error.response.data.error)
    } else {
      handleNotification('unknown error')
    }
  }

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      handleNotification(`Welcome ${user.username}`)
    } catch (error) {
      handleError(error)
    }

    console.log('logging in with', username, password)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
  }

  const createBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      handleNotification(`${returnedBlog.title} by ${returnedBlog.author} added`)
    } catch (error) {
      handleError(`Error: ${error.response.data.error}`)
    }
  }

  const deleteBlog = async (blogId) => {
    try {
      await blogService.deleteBlog(blogId)
      const newBlogs = blogs.filter((blog) => blog.id !== blogId)
      setBlogs(newBlogs)
      handleNotification('Blog deleted')
    } catch (error) {
      handleError(`Error: ${error.response.data.error}`)
    }
  }

  const updateBlog = async (blogObject) => {
    try {
    const updatedBlog = await blogService.update(blogObject.id, blogObject)

    if (typeof updatedBlog.user === 'string') {
      const original = blogs.find(b => b.id === blogObject.id)
      updatedBlog.user = original.user
    }

    setBlogs(blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b))
    handleNotification('Updated blogs')
    return updatedBlog
  } catch (error) {
    handleError(`Error: ${error.response.data.error}`)
  }
}

  return (
    <div>
      <h2>blogs</h2>

      <Notification notification={notification} />
      {user === null ? (
        <Loginform handleLogin={handleLogin} />
      ) : (
        <div>
          <p>
            {user.name} logged in
            <button type="button" onClick={handleLogout}>
              logout
            </button>
          </p>
          <Togglable buttonLabel="create new blog" ref={blogFormRef}>
            <Blogform createBlog={createBlog} />
          </Togglable>
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                username={user.username}
                deleteBlog={deleteBlog}
                updateLikes={updateBlog}
              />
            ))}
        </div>
      )}
    </div>
  )
}

export default App
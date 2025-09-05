import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ username, blog, updateLikes, deleteBlog }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  Blog.propTypes = {
  username: PropTypes.string.isRequired,
  blog: PropTypes.object.isRequired,
  updateLikes: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
}


  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible)
  }

  const handleLike = async () => {
    const blogToUpdate = {
      ...blog,
      user: blog.user.id || blog.user,
      likes: blog.likes + 1,
    }
    const updatedBlog = await updateLikes(blogToUpdate)

    //updatedBlog.user = blog.user
  }

  const handleDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog.id)
    }
  }

  return (
    <div className="blogItem" data-testid="blogItem">
      <div>
        <span>{blog.title} </span>
        <span>{blog.author} </span>
        <button onClick={toggleDetails}>
          {detailsVisible ? 'hide' : 'view'}
        </button>
      </div>

      {detailsVisible && (
        <div>
          <a href={blog.url}>{blog.url}</a>

          <div>
            <span>likes {blog.likes}</span>
            <button onClick={handleLike}>like</button>
          </div>

          <span>{blog.user.name}</span>

          {blog.user.username === username && (
            <div>
              <button onClick={handleDelete}>remove</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
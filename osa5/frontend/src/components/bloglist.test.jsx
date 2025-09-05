import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import Blogform from '../components/Blogform'

const blog = {
  title: 'Title for testing',
  author: 'Test Author',
  url: 'http://testurl.test/address',
  likes: 1,
  user: {
    username: 'testuser',
    name: 'Test User',
  }
}

const user = {
  username: 'newtestuser',
  name: 'User Test',
}

test('Renders blog title without url or likes', () => {
  render(<Blog blog={blog} username={user.username} updateLikes={() => {}} deleteBlog={() => {}} />)

  expect(screen.getByText('Title for testing')).toBeInTheDocument()
  expect(screen.getByText('Test Author')).toBeInTheDocument()
  expect(screen.queryByText('http://testurl.test/address')).not.toBeInTheDocument()
  expect(screen.queryByText(/likes/i)).not.toBeInTheDocument()
})

test('Renders title, author, url and likes', async () => {
  const userSim = userEvent.setup()

  render(<Blog blog={blog} username={user.username} updateLikes={() => {}} deleteBlog={() => {}} />)

  const button = screen.getByText('view')
  await userSim.click(button)

  expect(screen.getByText('http://testurl.test/address')).toBeInTheDocument()
  expect(screen.getByText(/likes 1/i)).toBeInTheDocument()
})

test('clicking like button twice calls event handler twice', async () => {
  const mockHandler = vi.fn()
  const userSim = userEvent.setup()

  render(
    <Blog
      blog={blog}
      username={user.username}
      updateLikes={mockHandler}
      deleteBlog={() => {}}
    />
  )

  const viewButton = screen.getByText('view')
  await userSim.click(viewButton)

  const likeButton = screen.getByText('like')
  await userSim.click(likeButton)
  await userSim.click(likeButton)

  expect(mockHandler).toHaveBeenCalledTimes(2)
})

test('calls event handler with correct details when new blog is created', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<Blogform createBlog={createBlog} />)

  await user.type(screen.getByTestId('title'), 'Testing Title')
  await user.type(screen.getByTestId('author'), 'Testing Author')
  await user.type(screen.getByTestId('url'), 'http://test.url')

  await user.click(screen.getByText('create'))

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog).toHaveBeenCalledWith({
    title: 'Testing Title',
    author: 'Testing Author',
    url: 'http://test.url',
  })
})
const { test, expect, beforeEach, describe } = require('@playwright/test')
const {loginWith, createBlog} = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('success with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
      await expect(page.getByRole('button', { name: 'create new blog' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'vaara', 'salasana')
      await expect(page.getByText('invalid username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page, request }) => {
      await request.post('http://localhost:3003/api/testing/reset')
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Matti Luukkainen',
          username: 'mluukai',
          password: 'salainen'
        }
      })
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Antti Luukkainen',
          username: 'atest',
          password: 'salasana'
        }
      })

      await page.goto('http://localhost:5173')
      await loginWith(page, 'mluukai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Test blog', 'Blog Poster', 'http://link.test')
      await expect(page.getByText('Test blog by Blog Poster added')).toBeVisible()
      await expect(page.getByText('Test blog Blog Poster')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'Test blog', 'Blog Poster', 'http://link.test')
      await page.getByRole('button', {name:'view'}).click()
      await page.getByRole('button', {name:'like'}).click()
      await expect(page.getByText('1')).toBeVisible()
    })

    test('a blog can be deleted', async ({ page }) => {
      page.on('dialog', dialog => dialog.accept())
      await createBlog(page, 'Test blog', 'Blog Poster', 'http://link.test')
      await page.getByRole('button', {name:'view'}).click()
      await expect(page.getByRole('button',{name:'remove'})).toBeVisible()
      await page.getByRole('button',{name:'remove'}).click()
      const blogElement = page.getByText('Test blog Blog Poster')
      await expect(blogElement).toHaveCount(0)
    })

    test('only creator can delete', async ({ page }) => {
      await createBlog(page, 'Test blog', 'Blog Poster', 'http://link.test')
      await page.getByRole('button', {name:'logout'}).click()
      await loginWith(page, 'atest', 'salasana')
      await page.getByRole('button', {name:'view'}).click()
      const deleteElement = page.getByRole('button', {name:'remove'})
      await expect(deleteElement).toHaveCount(0)
    })

    test('first test has most likes', async ({ page }) => {
      await createBlog(page, 'First blog', 'Blog Poster', 'http://link.test')
      const firstBlog = await page.getByText('First blog Blog Poster')
      const firstBlogLocator = await firstBlog.locator('..')
      await firstBlogLocator.getByRole('button', {name:'view'}).click()

      await createBlog(page, 'Second blog', 'Blog Poster', 'http://link.test')
      const secondBlog = await page.getByText('Second blog Blog Poster')
      const secondBlogLocator = await secondBlog.locator('..')
      await secondBlogLocator.getByRole('button', {name:'view'}).click()

      let listBlogs = await page.getByTestId('blogItem')
      let firstInList = await listBlogs.nth(0).getByText('First blog Blog Poster')
      await expect(firstInList).toBeVisible()

      await secondBlogLocator.getByRole('button', {name:'like'}).click()

      listBlogs = await page.getByTestId('blogItem')
      firstInList = await listBlogs.nth(0).getByText('Second blog Blog Poster')
      await expect(firstInList).toBeVisible()
    })
  })
  
})

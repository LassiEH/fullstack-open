const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const api = supertest(app)
const testHelper = require('./test_helper')

const bcrypt = require('bcrypt')
const User = require('../models/user')

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {

    const usersAtStart = await testHelper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await testHelper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })
})

describe('creating users fail cases', () => {

  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('fails when password is missing', async () => {
    const newUser = {
      username: 'testuser',
      name: 'Test User',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.match(result.body.error, /password not provided/)
  })

  test('fails when password is too short', async () => {
    const newUser = {
      username: 'shortpw',
      name: 'Short PW',
      password: 'ab'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.match(result.body.error, /provided password must be atleast 3 characters long/)
  })

  test('fails when username is missing', async () => {
    const newUser = {
      name: 'No Username',
      password: 'validpass'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.match(result.body.error, /`username` is required/)
  })

  test('fails when username is too short', async () => {
    const newUser = {
      username: 'ab',
      name: 'Too Short Username',
      password: 'validpass'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.match(result.body.error, /is shorter than the minimum allowed length/)
  })

  test('fails when username is not unique', async () => {
    const newUser = {
      username: 'root',
      name: 'Duplicate Username',
      password: 'validpass'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.match(result.body.error, /username must be unique/)
  })
})

after(async () => {
    await mongoose.connection.close()
})
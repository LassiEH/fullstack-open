const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]
  const listWithMultipleBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To',
      author: 'Edgar Hoover',
      url: 'http://go.to',
      likes: 2,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'Harmful',
      author: 'Daniel Keyes',
      url: 'http://www.u.arizona.edu/harmful',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f1',
      title: 'Statements',
      author: 'Helper Function',
      url: 'http://www.u.jyu.edu/~rubinson.html',
      likes: 8,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f2',
      title: 'Considered Harmful',
      author: 'Mannerheim',
      url: 'http://www.edu.html',
      likes: 10,
      __v: 0
    }
  ]

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('when list is empty the likes equal zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })

  test('multiple list items equal to correct value', () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs)
    assert.strictEqual(result, 25)
  })
})

describe('favorite blog', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]
  const listWithMultipleBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To',
      author: 'Edgar Hoover',
      url: 'http://go.to',
      likes: 2,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'Harmful',
      author: 'Daniel Keyes',
      url: 'http://www.u.arizona.edu/harmful',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f1',
      title: 'Statements',
      author: 'Helper Function',
      url: 'http://www.u.jyu.edu/~rubinson.html',
      likes: 8,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f2',
      title: 'Considered Harmful',
      author: 'Mannerheim',
      url: 'http://www.edu.html',
      likes: 10,
      __v: 0
    }
  ]
  const listSameLikes = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To',
      author: 'Edgar Hoover',
      url: 'http://go.to',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'Harmful',
      author: 'Daniel Keyes',
      url: 'http://www.u.arizona.edu/harmful',
      likes: 5,
      __v: 0
    }
  ]

  test('favorite blog from a list of only one blog', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    assert.deepStrictEqual(result, listWithOneBlog[0])
  })

  test('favorite blog from a list of many blogs with differing likes', () => {
    const result = listHelper.favoriteBlog(listWithMultipleBlogs)
    assert.deepStrictEqual(result, listWithMultipleBlogs[3])
  })

  test('favorite blog from a list of many blogs with same amount of likes', () => {
    const result = listHelper.favoriteBlog(listSameLikes)
    assert.deepStrictEqual(result, listSameLikes[0] || listSameLikes[1])
  })

  test('favorite from empty list', () => {
    const result = listHelper.favoriteBlog([])
    assert.deepStrictEqual(result, [])
  })
})

describe('most blogs', () => {
  const listWithMultipleBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To',
      author: 'Edgar Hoover',
      url: 'http://go.to',
      likes: 2,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'Harmful',
      author: 'Daniel Keyes',
      url: 'http://www.u.arizona.edu/harmful',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f1',
      title: 'Statements',
      author: 'Edgar Hoover',
      url: 'http://www.u.jyu.edu/~rubinson.html',
      likes: 8,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f2',
      title: 'Considered Harmful',
      author: 'Mannerheim',
      url: 'http://www.edu.html',
      likes: 10,
      __v: 0
    }
  ]

  test('most blogs from a list of many blogs with different authors', () => {
    const result = listHelper.mostBlogs(listWithMultipleBlogs)
    assert.deepEqual(result,
      {
        author: 'Edgar Hoover',
        blogs: 2
      }
    )
  })

  test('most blogs from empty list', () => {
    const result = listHelper.mostBlogs([])
    assert.deepEqual(result,
      {
        author: null,
        blogs: 0
      }
    )
  })

})

describe('most likes', () => {
  const listWithMultipleBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To',
      author: 'Edgar Hoover',
      url: 'http://go.to',
      likes: 2,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'Harmful',
      author: 'Daniel Keyes',
      url: 'http://www.u.arizona.edu/harmful',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f1',
      title: 'Statements',
      author: 'Edgar Hoover',
      url: 'http://www.u.jyu.edu/~rubinson.html',
      likes: 8,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f2',
      title: 'Considered Harmful',
      author: 'Mannerheim',
      url: 'http://www.edu.html',
      likes: 10,
      __v: 0
    }
  ]

  const listWithClearMostLiked = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To',
      author: 'Edgar Hoover',
      url: 'http://go.to',
      likes: 2,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'Harmful',
      author: 'Daniel Keyes',
      url: 'http://www.u.arizona.edu/harmful',
      likes: 100,
      __v: 0
    }
  ]

  test('most likes from a list with multiple blogs with same likes', () => {
    const result = listHelper.mostLikes(listWithMultipleBlogs)
    assert.deepEqual(result,
      {
        author: 'Edgar Hoover',
        likes: 10
      } ||
      {
        author: 'Mannerheim',
        likes: 10
      }
    )
  })

  test('most likes from a list with clearly more liked blog', () => {
    const result = listHelper.mostLikes(listWithClearMostLiked)
    assert.deepEqual(result,
      {
        author: 'Daniel Keyes',
        likes: 100
      }
    )
  })
})
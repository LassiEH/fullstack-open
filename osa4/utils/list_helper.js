const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => {
        return sum + blog.likes
    }, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((currentFavorite, blog) => {
        return blog.likes > currentFavorite.likes ? blog : currentFavorite
    }, blogs[0] || [])
}

const mostBlogs = (blogs) => {
    const counts = {};

    for (const blog of blogs) {
        counts[blog.author] = (counts[blog.author] || 0) + 1;
    }

    return Object.entries(counts).reduce((max, [author, count]) => {
        return count > max.blogs ? { author, blogs: count } : max;
    }, { author: null, blogs: 0 })
}

const mostLikes = (blogs) => {
  const likeTotals = {};

  for (const blog of blogs) {
    likeTotals[blog.author] = (likeTotals[blog.author] || 0) + blog.likes;
  }

  return Object.entries(likeTotals).reduce((max, [author, likes]) => {
    return likes > max.likes ? { author, likes } : max;
  }, { author: null, likes: 0 })
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}
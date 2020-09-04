// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1;
};

// return total likes for 3 different scenarios
const totalLikes = (blogs) => {
  if (blogs.length === 0) return 0;
  if (blogs.length === 1) return blogs[0].likes;
  return blogs.reduce((sum, item) => sum + item.likes, 0);
};

// return info about blog with most likes
const favBlog = (blogs) => {
  const blog = blogs.reduce((prev, current) => prev.likes > current.likes ? prev : current);
  return {
    title: blog.title,
    author: blog.author,
    likes: blog.likes
  };
};

// return info about author with most blogs
const mostBlogs = (blogs) => {
  const netObj = {};
  blogs.map(item => {
    let itemAuthor = item.author;
    if (itemAuthor in netObj) {
      netObj[itemAuthor].blogs += 1;
    } else {
      netObj[itemAuthor] = { author: item.author };
      netObj[itemAuthor].blogs = 1;
    }
  });

  const findTopBlogsAuthor = (array) => {
    const reducer = (top, item) => {
      if (item.blogs >= top.blogs) {
        top = item;
      }
      return {
        author: top.author,
        blogs: top.blogs
      };
    };

    return array.length === 0
      ? {}
      : array.reduce(reducer, { blogs: 1 });
  };

  return findTopBlogsAuthor(Object.values(netObj));
};

// return info about author with most likes
const mostLikes = (blogs) => {
  const netObj = {};
  blogs.map(item => {
    let itemAuthor = item.author;
    if (itemAuthor in netObj) {
      netObj[itemAuthor].likes += item.likes;
    } else {
      netObj[itemAuthor] = { author: item.author };
      netObj[itemAuthor].likes = item.likes;
    }
  });

  const findTopLikesAuthor = (array) => {
    const reducer = (top, item) => {
      if (item.likes >= top.likes) {
        top = item;
      }
      return {
        author: top.author,
        likes: top.likes
      };
    };

    return array.length === 0
      ? {}
      : array.reduce(reducer, { likes: 0 });
  };

  return findTopLikesAuthor(Object.values(netObj));
};

module.exports = {
  dummy,
  totalLikes,
  favBlog,
  mostBlogs,
  mostLikes
};

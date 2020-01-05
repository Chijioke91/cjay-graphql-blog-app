import getUserId from '../utils/getUserId';

const Query = {
  me(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.query.user(
      {
        where: {
          id: userId
        }
      },
      info
    );
  },

  comments(parent, { first, skip, after, orderBy }, { prisma }, info) {
    const opArgs = {
      first,
      skip,
      after,
      orderBy
    };

    // return db.comments;
    return prisma.query.comments(opArgs, info);
  },

  users(parent, { query, first, skip, after, orderBy }, { prisma }, info) {
    const opArgs = {
      first,
      skip,
      after,
      orderBy
    };

    if (query) {
      opArgs.where = {
        OR: [{ name_contains: query }]
      };
    }

    return prisma.query.users(opArgs, info);
  },
  async post(parent, { id }, { prisma, request }, info) {
    const userId = getUserId(request, false);

    const posts = await prisma.query.posts(
      {
        where: {
          id,
          OR: [{ author: { id: userId } }, { published: true }]
        }
      },
      info
    );

    if (posts.length === 0) {
      throw new Error('Post Not Found');
    }

    return posts[0];
  },
  posts(parent, { query, first, skip, after, orderBy }, { prisma }, info) {
    const opArgs = {
      first,
      skip,
      after,
      orderBy,
      where: {
        published: true
      }
    };

    opArgs.where.OR = [{ body_contains: query }, { title_contains: query }];

    return prisma.query.posts(opArgs, info);
  },

  async myPosts(
    parent,
    { query, first, skip, after, orderBy },
    { prisma, request },
    info
  ) {
    const userId = getUserId(request);

    const opArgs = {
      first,
      skip,
      after,
      orderBy
    };

    opArgs.where = {
      author: {
        id: userId
      }
    };

    if (query) {
      opArgs.where.OR = [{ body_contains: query }, { title_contains: query }];
    }

    return prisma.query.posts(opArgs, info);
  }
};

export default Query;

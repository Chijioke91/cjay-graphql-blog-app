import bcrypt from 'bcryptjs';
import getUserId from '../utils/getUserId';
import generateToken from '../utils/generateToken';
import hashPassword from '../utils/hashPassword';

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const emailTaken = await prisma.exists.User({ email: args.data.email });

    if (emailTaken) {
      throw new Error('Email Already Taken');
    }

    const password = await hashPassword(args.data.password);

    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password
      }
    });

    const token = generateToken(user.id);

    return {
      user,
      token
    };
  },

  async loginUser(parent, { data: { email, password } }, { prisma }, info) {
    // fetch user from db
    const user = await prisma.query.user({
      where: {
        email
      }
    });

    if (!user) {
      throw new Error('Unable to login');
    }

    const hashedPassword = user.password;

    // check for password match
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) {
      throw new Error('Unable to login');
    }

    const token = generateToken(user.id);

    return {
      user,
      token
    };
  },

  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.deleteUser(
      {
        where: {
          id: userId
        }
      },
      info
    );
  },

  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    if (typeof args.data.password === 'string') {
      args.data.password = await hashPassword(args.data.password);
    }

    return prisma.mutation.updateUser(
      {
        where: {
          id: userId
        },
        data: args.data
      },
      info
    );
  },
  async createPost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.createPost(
      {
        data: {
          ...args.data,
          author: {
            connect: {
              id: userId
            }
          }
        }
      },
      info
    );
  },

  async updatePost(parent, { id, data }, { prisma, request }, info) {
    const userId = getUserId(request);

    const postExists = await prisma.exists.Post({
      id,
      author: {
        id: userId
      }
    });

    const isPublished = await prisma.exists.Post({
      id,
      published: true
    });

    if (!postExists) {
      throw new Error('Unable to update post');
    }

    if (isPublished && data.published === false) {
      await prisma.mutation.deleteManyComments({
        where: {
          post: {
            id
          }
        }
      });
    }

    return prisma.mutation.updatePost(
      {
        where: {
          id
        },
        data
      },
      info
    );
  },

  async deletePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    });

    if (!postExists) {
      throw new Error('Unable to delete post');
    }

    return prisma.mutation.deletePost(
      {
        where: {
          id: args.id
        }
      },
      info
    );
  },

  async createComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const postExists = await prisma.exists.Post({
      id: args.data.post,
      published: true
    });

    if (!postExists) {
      throw new Error('Unable to find post');
    }

    return prisma.mutation.createComment(
      {
        data: {
          text: args.data.text,
          author: {
            connect: {
              id: userId
            }
          },
          post: {
            connect: {
              id: args.data.post
            }
          }
        }
      },
      info
    );
  },
  async updateComment(
    parent,
    { id, data: { text } },
    { prisma, request },
    info
  ) {
    const userId = getUserId(request);

    const commentExists = await prisma.exists.Comment({
      id,
      author: {
        id: userId
      }
    });

    if (!commentExists) {
      throw new Error('Unable to update comment');
    }

    return prisma.mutation.updateComment(
      {
        data: {
          text
        },
        where: {
          id
        }
      },
      info
    );
  },
  async deleteComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId
      }
    });

    if (!commentExists) {
      throw new Error('Unable to delete comment');
    }

    return prisma.mutation.deleteComment(
      {
        where: {
          id: args.id
        }
      },
      info
    );
  }
};

export default Mutation;

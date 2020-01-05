const users = [
  {
    id: '1',
    name: 'Michael',
    email: 'mch@yahoo.com',
    age: 25
  },
  {
    id: '2',
    name: 'Jeremiah',
    email: 'jer@yahoo.com',
    age: 28
  },
  {
    id: '3',
    name: 'Sarah',
    email: 'sarah@yahoo.com',
    age: 22
  }
];

// dummy comment data
const comments = [
  {
    id: '101',
    text: 'comment 1',
    author: '1',
    post: '3'
  },
  {
    id: '102',
    text: 'comment 2',
    author: '2',
    post: '2'
  },
  {
    id: '103',
    text: 'comment 3',
    author: '2',
    post: '3'
  },
  {
    id: '104',
    text: 'comment 3',
    author: '3',
    post: '1'
  }
];

// dummy post data
const posts = [
  {
    id: '10',
    title: 'post 1',
    body: 'This is post 1',
    published: false,
    author: '1'
  },
  {
    id: '20',
    title: 'post 2',
    body: 'This is post 2',
    published: true,
    author: '3'
  },
  {
    id: '30',
    title: 'post 3',
    body: 'This is post 3',
    published: false,
    author: '1'
  }
];

const db = { comments, users, posts };

export default db;

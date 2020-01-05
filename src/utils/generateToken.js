import jwt from 'jsonwebtoken';

const generateToken = userId => {
  return jwt.sign({ userId }, 'myjwtsecret2020', { expiresIn: '7 days' });
};

export default generateToken;

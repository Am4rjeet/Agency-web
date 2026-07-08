import jwt from 'jsonwebtoken';
import config from '../config/aiConfig.js';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Missing token, administrative access denied' });
  }

  const secret = process.env.JWT_SECRET || 'amarixSecretTokenKey2026!';

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token is invalid or has expired' });
    }
    req.user = user;
    next();
  });
}

export default authenticateToken;

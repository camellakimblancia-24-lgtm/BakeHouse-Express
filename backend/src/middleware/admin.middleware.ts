import type { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../lib/supabaseAdmin.js';

interface AuthRequest extends Request {
  user?: any;
}

export const verifyAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access token missing or malformed.' });
    }

    const token = authHeader.split(' ')[1];

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }

    const role = user.user_metadata?.role;
    if (role !== 'admin' && role !== 'manager') {
      return res.status(403).json({ message: 'Forbidden: Managers or Admins only.' });
    }

    req.user = user;
    next();
  } catch (err: unknown) {
    return res.status(401).json({ message: 'Authentication failed.' });
  }
};
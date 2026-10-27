import type { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

interface AuthRequest extends Request {
  user?: any;
}

export const verifyManagerOrAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access token missing or malformed.' });
    }

    const token = authHeader.split(' ')[1];

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }

    // Check if role is either manager or admin
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
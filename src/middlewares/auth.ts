import type { Request, Response, NextFunction } from 'express';

const INT_Secret = process.env.INT_SECRET ?? '';

function base64Encode(str: string): string {

  return Buffer.from(str.replace(/\-/g, '+').replace('/\//g', '/')).toString('utf8');
 
}
export function requiereJWT(req: Request, res: Response, _next: NextFunction) {

  const authHeader = req.headers['authorization'] ??'';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }/-

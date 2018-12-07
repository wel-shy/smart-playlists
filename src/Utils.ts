import * as path from 'path';
import { promisify } from 'util';
import * as fs from 'fs';
import { User } from './web/entities/User';
import * as jwt from 'jsonwebtoken';

const readFile = promisify(fs.readFile);

/**
 * Generate a random string of a given length
 * @param {number} length
 * @returns {string}
 */
export function generateRandomString(length: number): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let count = 0;
  while (count < length) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
    count += 1;
  }

  return text;
}

/**
 * Get text from a file.
 * @param {string} fileName
 * @returns {Promise<string>}
 */
export async function getTextFromFile(fileName: string): Promise <string> {
  const filePath = path.join(__dirname, `/../data/${fileName}`);
  return (await readFile(filePath, 'utf8')).trim();
}

export function generateToken(user: User): string {
  const payload = {
    id: user.id,
  };

  return jwt.sign(payload, process.env.SECRET, {
    expiresIn: '1 day',
  });
}

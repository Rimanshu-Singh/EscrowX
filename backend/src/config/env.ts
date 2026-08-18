import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function optionalEnv(name: string, fallback: string): string {
  return process.env[name] || fallback;
}

export const env = {
  NODE_ENV: optionalEnv('NODE_ENV', 'development'),
  PORT: Number(optionalEnv('PORT', '5000')),
  CORS_ORIGIN: optionalEnv('CORS_ORIGIN', '*'),
  MONGO_URL: requireEnv('MONGO_URL'),
  JWT_SECRET: requireEnv('JWT_SECRET'),
} as const;

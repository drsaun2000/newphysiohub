import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import path from 'path';

@Injectable()
export class SirvService {
  private readonly clientId = process.env.SIRV_CLIENT_ID;
  private readonly clientSecret = process.env.SIRV_CLIENT_SECRET;
  private readonly sirvDomain = process.env.SIRV_DOMAIN;

  private accessToken: string;
  private tokenExpiry: number;

  async authenticate(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await axios.post('https://api.sirv.com/v2/token', {
        clientId: this.clientId,
        clientSecret: this.clientSecret,
      });

      this.accessToken = response.data.token;
      this.tokenExpiry = Date.now() + response.data.expiresIn * 1000 - 60000;

      return this.accessToken;
    } catch (error) {
      const err = error as AxiosError;
      throw new InternalServerErrorException('Sirv authentication failed');
    }
  }

  sanitizeFileName(originalName: string): string {
    const ext = path.extname(originalName).toLowerCase();

    const safeExt = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff', '.pdf'].includes(ext)
      ? ext
      : '.png';

    let base = path.basename(originalName, ext).toLowerCase();

    base = base
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!/^[a-z0-9]/.test(base)) {
      base = 'file-' + base;
    }

    if (base.length > 40) {
      base = base.slice(0, 40);
    }

    return `${base}${safeExt}`;
  }

async uploadBuffer(fileBuffer: Buffer, remotePath: string): Promise<string> {
  const token = await this.authenticate();

  // Sanitize the filename *without* the slash
  const sanitizedFileName = this.sanitizeFileName(remotePath);

  // Prepend the slash AFTER sanitization
  const finalFileName = `/${sanitizedFileName}`;

  const uploadUrl = 'https://api.sirv.com/v2/files/upload';

  try {
    await axios.post(uploadUrl, fileBuffer, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/octet-stream',
        'Content-Length': fileBuffer.length.toString(),
      },
      params: {
        filename: finalFileName, // ✅ this has the leading slash now
      },
      maxBodyLength: Infinity,
    });

    return `${this.sirvDomain}${finalFileName}`; // ✅ include slash here too
  } catch (error) {
    const err = error as AxiosError;
    throw new InternalServerErrorException('Upload to Sirv failed');
  }
}

}

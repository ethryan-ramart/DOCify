// pages/api/downloadPdf.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  
  const fileUrl = searchParams.get("fileUrl") as string;
  // const fileUrl = 'https://hgmrcazhpttcvypgizcs.supabase.co/storage/v1/object/public/documents/6a2723fb-dd9e-44f4-97f2-1d97f95d0918/bbeee322-8e99-49f7-bb94-5d8eab112482-Chang%20Management%20ERP%20Case%20Study.pdf'
  
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const buffer = await response.buffer();
    const tempDir = path.join(process.cwd(), 'temp');
    await fs.mkdir(tempDir, { recursive: true });

    const fileName = path.basename(fileUrl);
    const filePath = path.join(tempDir, fileName);

    await fs.writeFile(filePath, buffer);

    // console.log('File downloaded and saved at:', filePath);
    return NextResponse.json({ filePath });

  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

// app/api/generate-image/route.ts

import { NextResponse } from 'next/server';
import OpenAI from "openai";


interface GenerateImageRequest {
  prompt: string;
  appKey: string;
}

const openai = new OpenAI({ apiKey: process.env.OPEN_API_KEY });

export async function POST(request: Request) {
  try {
    const { prompt, appKey }: GenerateImageRequest = await request.json();

    // ตรวจสอบว่ามี prompt และ appKey หรือไม่
    if (!prompt || !appKey) {
      return NextResponse.json(
        { message: 'Prompt และ App Key เป็นข้อมูลที่จำเป็น' },
        { status: 400 }
      );
    }

    // ตรวจสอบว่า appKey ตรงกับค่าใน environment หรือไม่
    if (appKey !== process.env.APP_API_KEY) {
      return NextResponse.json(
        { message: 'App Key ไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    // เรียกใช้ OpenAI API เพื่อสร้างภาพ
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
    })

    console.log('response', response)
    // ตรวจสอบโครงสร้างข้อมูลที่ได้รับจาก OpenAI API
    const imageUrl = response?.data[0]?.url

    if (!imageUrl) {
      return NextResponse.json(
        { message: 'ไม่สามารถสร้างภาพได้ในขณะนี้' },
        { status: 500 }
      )
    }

    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch (error: any) {
    console.error(
      'Error generating image:',
      error.response ? error.response.data : error.message
    );
    return NextResponse.json(
      { message: 'เกิดข้อผิดพลาดในการสร้างภาพ' },
      { status: 500 }
    );
  }
}

// จัดการ HTTP methods อื่นๆ
export async function GET(request: Request) {
  return NextResponse.json({ message: 'Method GET Not Allowed' }, { status: 405 });
}

export async function PUT(request: Request) {
  return NextResponse.json({ message: 'Method PUT Not Allowed' }, { status: 405 });
}

export async function DELETE(request: Request) {
  return NextResponse.json({ message: 'Method DELETE Not Allowed' }, { status: 405 });
}

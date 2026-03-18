import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(req: NextRequest) {
  try {
    const res = new NextResponse();

    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ products });
  } catch (err) {
    console.error('[GET /api/admin/inventory]', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

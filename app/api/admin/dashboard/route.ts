import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import UserProfile from '@/models/UserProfile';

export async function GET(req: NextRequest) {
  try {
    const res = new NextResponse();

    await connectDB();

    // Promises
    const [ordersCount, productsCount, customersCount, orders, totalSalesAgg] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      UserProfile.countDocuments(),
      Order.find().sort({ createdAt: -1 }).limit(5).lean(), // recent 5
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ])
    ]);

    const totalSales = totalSalesAgg[0]?.total || 0;

    return NextResponse.json({
      metrics: {
        totalSales,
        ordersCount,
        productsCount,
        customersCount,
      },
      recentOrders: orders,
    });
  } catch (err) {
    console.error('[GET /api/admin/dashboard]', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

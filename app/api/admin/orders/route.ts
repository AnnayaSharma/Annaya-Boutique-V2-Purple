import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import UserProfile from '@/models/UserProfile';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    
    // Fetch user details for these orders
    const userIds = [...new Set(orders.map(o => o.userId))];
    const users = await UserProfile.find({ userId: { $in: userIds } }).lean();
    const userMap = users.reduce((acc, u) => {
      acc[u.userId] = u;
      return acc;
    }, {} as Record<string, any>);

    const enrichedOrders = orders.map((o: any) => ({
      ...o,
      customerEmail: userMap[o.userId]?.email || 'Guest',
      customerName: userMap[o.userId]?.name || o.shippingAddress?.fullName || 'Guest',
    }));

    return NextResponse.json({ orders: enrichedOrders });
  } catch (err) {
    console.error('[GET /api/admin/orders]', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) return NextResponse.json({ message: 'ID and status required' }, { status: 400 });

    await connectDB();
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error('[PATCH /api/admin/orders]', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

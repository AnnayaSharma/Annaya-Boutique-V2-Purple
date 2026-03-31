import { connectDB } from '@/lib/mongodb';
import ProductModel from '@/models/Product';
import { unstable_cache } from 'next/cache';
import ShopClient from './ShopClient';
import { Product } from '@/types';

// Cache the product catalog for 1 hour to prevent constant MongoDB/Edge usage
const getProducts = unstable_cache(
  async () => {
    await connectDB();
    const docs = await ProductModel.find().lean();
    return docs.map((doc: any) => {
      const p = { ...doc, id: doc._id?.toString() || doc.id };
      delete p._id;
      delete p.__v;
      return p as Product;
    });
  },
  ['all-products-catalog'],
  { revalidate: 3600 }
);

export default async function ShopPage() {
  const products = await getProducts();
  return <ShopClient initialProducts={JSON.parse(JSON.stringify(products))} />;
}

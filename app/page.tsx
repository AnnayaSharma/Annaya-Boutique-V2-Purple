import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronRight, Star, Quote } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { Product as ProductType } from '@/types';

function mapDocToProduct(doc: any): ProductType {
  const p = JSON.parse(JSON.stringify(doc));
  return { ...p, id: p._id ? p._id : p.id };
}

export default async function HomePage() {
  await connectDB();
  const rawFeatured = await Product.find({ isNewArrival: true }).sort({ createdAt: -1 }).lean();
  const rawNewArrivals = await Product.find({ isNewArrival: true }).limit(6).lean();
  const categoriesDocs = await Product.distinct('category');

  const featured = rawFeatured.map(mapDocToProduct);
  const newArrivals = rawNewArrivals.map(mapDocToProduct);
  const categories = Array.isArray(categoriesDocs) ? categoriesDocs.sort() : [];

  return (
    <div className="pb-32">
      {/* Hero */}
      <section className="relative h-[70vh] md:h-[90vh] w-full overflow-hidden">
        <Image
          src="/Hero Image.jpeg"
          alt="Royal Collection" fill priority
          className="object-cover object-center md:object-[center_20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-purple/80 via-deep-purple/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-24 pb-20 md:pb-32">
          <div className="max-w-7xl mx-auto w-full">
            <span className="text-white/70 uppercase tracking-[0.3em] text-xs md:text-sm font-medium mb-2 block">
              The Festive Edit
            </span>
            <h1 className="text-white text-5xl md:text-8xl font-serif leading-tight mb-8 md:max-w-3xl">
              Royal Elegance <br /> Reimagined
            </h1>
            <Link href="/shop"
              className="inline-flex items-center gap-3 bg-white text-royal-purple px-10 py-5 rounded-full font-bold shadow-xl hover:bg-royal-purple hover:text-white transition-all">
              Explore Collection <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 md:py-20 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-serif font-bold">Shop by Category</h2>
          <Link href="/shop" className="text-royal-purple text-sm font-medium flex items-center gap-1 hover:underline">
            View All <ChevronRight size={18} />
          </Link>
        </div>
        <div className="flex gap-4 flex-wrap">
          {categories.map((cat: string) => (
            <Link key={cat} href={`/shop?category=${encodeURIComponent(cat)}`}
              className="px-6 py-2.5 rounded-full text-sm font-medium bg-white text-muted-text border border-luxury-border hover:border-royal-purple/40 hover:text-royal-purple transition-all">
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Picks */}
      <section className="py-16 md:py-24 px-4 md:px-12 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-2 mb-10 md:mb-16">
            <span className="text-royal-purple text-xs uppercase tracking-widest font-bold">Handpicked for you</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold">Royal Picks</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Story Block */}
      <section className="py-20 md:py-32 px-8 md:px-12 bg-lavender-bg">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-serif mb-8 text-deep-purple">
            Designed for Royal Elegance
          </h2>
          <p className="text-muted-text text-lg md:text-xl leading-relaxed mb-10">
            Annaya Boutique brings you a curated collection of premium feminine fashion that blends traditional
            craftsmanship with modern silhouettes. Every piece is a celebration of your inner royalty.
          </p>
          <div className="w-16 h-px bg-royal-purple/30 mx-auto" />
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 md:px-12">
        <div className="flex items-center justify-between mb-10 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold">New Arrivals</h2>
          <Link href="/shop?filter=new" className="text-royal-purple font-medium hover:underline">See More</Link>
        </div>
        <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-4 md:grid md:grid-cols-3 md:overflow-visible">
          {newArrivals.map(p => (
            <div key={p.id} className="min-w-[280px] md:min-w-0">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-32 bg-white px-4 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#002E5D]">What Our Customers Say</h2>
          </div>
          <div className="grid grid-rows-3 grid-flow-col gap-4 md:gap-6 overflow-x-auto hide-scrollbar pb-8 snap-x snap-mandatory scroll-smooth">
            {[
              { name: 'Lavanya', subtitle: 'One Year With Us', image: './1.jpg', text: 'The kurti I ordered arrived on time, looked exactly like the picture — and was even more beautiful in person! The quality is high and the fit is perfect. Thank you, Annaya Boutique!' },
              { name: 'Priya S.', subtitle: 'Six Months With Us', image: './2.jpg', text: 'The quality of the Banarasi Silk is unmatched. I wore the Lehengas for my sisters wedding and I truly felt like royalty. Absolute perfection!' },
              { name: 'Megha R.', subtitle: 'First time buyer', image: './3.jpg', text: 'Exceptional craftsmanship. You can see the attention to detail in the embroidery. The packaging itself was a luxurious experience.' },
              { name: 'Aisha K.', subtitle: 'Loyal Customer', image: './4.jpg', text: 'I am in love with their latest collection! The colors are vibrant and the fabric is incredibly soft. I highly recommend them for festive wear.' },
              { name: 'Sneha P.', subtitle: 'Recent Buyer', image: './5.jpg', text: 'I was hesitant about buying ethnic wear online, but Annaya Boutique exceeded my expectations. The sizing guide was perfectly accurate.' },
              { name: 'Kavita M.', subtitle: 'Two Years With Us', image: './6.jpg', text: 'Every time I wear an outfit from Annaya, I receive so many compliments. Their designs truly make you stand out from the crowd in the best way possible.' },
              { name: 'Riya J.', subtitle: 'First time buyer', image: './1.jpg', text: 'The customer service is outstanding. They helped me choose the right size and ensured the delivery reached me before my event. Oh, and the dress is gorgeous!' },
              { name: 'Neha V.', subtitle: 'Regular Shopper', image: './2.jpg', text: 'I appreciate the blend of traditional motifs with contemporary cuts. It makes their clothing so versatile for both family functions and formal office parties.' },
              { name: 'Shruti T.', subtitle: 'Three Months With Us', image: './3.jpg', text: 'Bought a stunning Anarkali suit. The flare is exactly as shown in the video and the tassels add such a cute touch. Definitely coming back for more.' },
              { name: 'Aditi D.', subtitle: 'First time buyer', image: './4.jpg', text: 'The stitching is impeccable, no loose threads anywhere. You can genuinely tell they care about the quality of the garments they produce and sell.' },
              { name: 'Simran K.', subtitle: 'One Year With Us', image: './5.jpg', text: 'I ordered the pastel floral lehenga for my best friend\'s reception. It was lightweight, breathable, and an absolute dream to twirl in!' },
              { name: 'Tanya B.', subtitle: 'Frequent Buyer', image: './6.jpg', text: 'My go-to place for last-minute ethnic outfits. Deliveries are always prompt and I never have to worry about alterations. Perfectly tailored!' }
            ].map((t, i) => (
              <div key={i} className="w-[300px] md:w-[400px] snap-center bg-white p-6 md:p-8 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col text-left relative">
                <Quote size={40} className="absolute top-6 md:top-8 right-6 md:right-8 text-[#EADDCD] fill-[#EADDCD] rotate-180" />
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 relative rounded-full overflow-hidden flex-shrink-0">
                    <Image src={t.image} alt={t.name} fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-bold text-[#002E5D] text-base md:text-lg leading-tight">{t.name}</h4>
                    <span className="text-[#8BA8CD] text-xs md:text-sm">{t.subtitle}</span>
                  </div>
                </div>
                <div className="flex gap-1 mb-3 md:mb-4">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} className="text-[#E0BB48] fill-[#E0BB48]" />)}
                </div>
                <p className="text-[#496E8F] text-sm md:text-[15px] leading-relaxed flex-1">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo */}
      <section className="px-4 md:px-12 py-12 md:py-20 max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-r from-royal-purple to-deep-purple p-10 md:p-20 text-white">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative z-10 max-w-2xl">
            <h3 className="text-3xl md:text-5xl font-serif mb-4">Festive Royal Drop</h3>
            <p className="text-white/80 text-lg md:text-xl mb-10 leading-relaxed">
              Exclusive designs for the upcoming wedding season. Handcrafted with love and royal precision.
            </p>
            <Link href="/shop" className="inline-block bg-white text-royal-purple px-10 py-4 rounded-full font-bold shadow-xl hover:bg-lavender-bg transition-colors">
              Shop the Collection
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

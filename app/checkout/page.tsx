'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, Check, CreditCard, Truck, MapPin, ArrowRight, Loader2, MessageCircle, AlertCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getImage } from '@/types';

interface Address {
  fullName: string; phone: string; email: string;
  addressLine1: string; addressLine2: string;
  city: string; state: string; pincode: string;
}

const PAYMENT_METHODS = ['Order via WhatsApp'];

const Field = ({ label, value, onChange, type = 'text', span2 = false }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  span2?: boolean;
}) => (
  <div className={span2 ? 'md:col-span-2' : ''}>
    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-text ml-4 mb-1 block">{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={label}
      className="w-full bg-white border border-luxury-border rounded-2xl px-6 py-4 outline-none focus:border-royal-purple transition-colors text-sm" />
  </div>
);

const ActionBtn = ({
  mobile = false,
  step,
  handleNext,
  handlePlace,
  processing,
  payment
}: {
  mobile?: boolean;
  step: number;
  handleNext: () => void;
  handlePlace: () => void;
  processing: boolean;
  payment: string;
}) => (
  step < 2 ? (
    <button onClick={handleNext}
      className={`w-full bg-royal-purple text-white font-bold flex items-center justify-center gap-3 shadow-xl shadow-royal-purple/20 active:scale-95 transition-transform ${mobile ? 'h-16 rounded-2xl text-lg' : 'h-14 rounded-xl hover:opacity-90 transition-opacity'}`}>
      Continue <ArrowRight size={mobile ? 22 : 20} />
    </button>
  ) : (
    <button onClick={handlePlace} disabled={processing}
      className={`w-full text-white font-bold flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-transform disabled:opacity-70 ${mobile ? 'h-16 rounded-2xl text-lg' : 'h-14 rounded-xl hover:opacity-90 transition-opacity'} ${payment === 'Order via WhatsApp' ? 'bg-[#25D366] shadow-[#25D366]/20' : 'bg-royal-purple shadow-royal-purple/20'}`}>
      {processing
        ? <><Loader2 size={mobile ? 22 : 20} className="animate-spin" /> Processing…</>
        : payment === 'Order via WhatsApp'
          ? <><MessageCircle size={mobile ? 22 : 20} /> Order on WhatsApp</>
          : <><Check size={mobile ? 22 : 20} /> Place Order</>
      }
    </button>
  )
);

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, setLastOrderId, clearCart } = useApp();

  const [step, setStep] = useState(1);
  const [processing, setProc] = useState(false);
  const [error, setError] = useState('');
  const [payment, setPayment] = useState(PAYMENT_METHODS[0]);
  const [addr, setAddr] = useState<Address>({
    fullName: '', phone: '',
    email: '', addressLine1: '',
    addressLine2: '', city: '', state: '', pincode: '',
  });

  const subtotal = cart.reduce((a, i) => a + i.price * i.quantity, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  const set = (f: keyof Address, v: string) => setAddr(p => ({ ...p, [f]: v }));

  const validate = () => {
    for (const f of ['fullName', 'phone', 'email', 'addressLine1', 'city', 'state', 'pincode'] as (keyof Address)[]) {
      if (!addr[f].trim()) {
        setError(`Please fill in: ${f.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    setError(''); return true;
  };

  const handleNext = () => {
    if (step === 1 && !validate()) return;
    setError(''); setStep(s => s + 1);
  };



  const finalise = async () => {
    setProc(true); setError('');
    try {
      clearCart();
      router.push('/success');
    } catch (e: any) {
      setError(e.message || 'Order placement failed. Please try again.');
    } finally { setProc(false); }
  };

  const handlePlace = () => {
    if (payment === 'Order via WhatsApp') {
      const itemsList = cart.map(i => `${i.name} (Size: ${i.selectedSize}, Color: ${i.selectedColor || 'N/A'}, Qty: ${i.quantity})`).join('\n');
      const orderSummary = `Hi, I would like to place an order!\n\n*Cart Items:*\n${itemsList}\n\n*Total Checkout Amount: ₹${total.toLocaleString()}*\n\n*My Delivery Details:*\nName: ${addr.fullName}\nPhone: ${addr.phone}\nEmail: ${addr.email}\nAddress: ${addr.addressLine1}, ${addr.addressLine2 ? addr.addressLine2 + ', ' : ''}${addr.city}, ${addr.state} - ${addr.pincode}`;

      const msg = encodeURIComponent(orderSummary);
      window.open(`https://wa.me/917600558179?text=${msg}`, '_blank');

      finalise();
      return;
    }
  };

  const steps = [
    { id: 1, title: 'Address', icon: MapPin },
    { id: 2, title: 'Payment', icon: CreditCard },
  ];

  return (
    <div className="pb-40 bg-lavender-bg min-h-screen">
      {/* Mobile header */}
      <div className="md:hidden bg-white px-4 py-5 flex items-center gap-4 border-b border-luxury-border">
        <button onClick={() => step > 1 ? setStep(s => s - 1) : router.back()} className="p-2 hover:bg-lavender-bg rounded-full transition-colors"><ChevronLeft size={24} /></button>
        <h1 className="text-xl font-serif font-bold">Checkout</h1>
      </div>

      <div className="max-w-7xl mx-auto md:px-12 md:py-8">
        {/* Desktop Back Button */}
        <div className="hidden md:flex mb-6">
          <button onClick={() => step > 1 ? setStep(s => s - 1) : router.back()}
            className="flex items-center gap-2 text-sm font-bold text-muted-text hover:text-royal-purple transition-colors">
            <ChevronLeft size={20} /> Back
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* Left — stepper + forms */}
          <div className="flex-1 px-6 md:px-0">
            {/* Stepper */}
            <div className="py-8 flex justify-between relative mb-8">
              <div className="absolute top-[52px] left-12 right-12 h-0.5 bg-luxury-border -z-10" />
              {steps.map(s => (
                <div key={s.id} className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${step >= s.id ? 'bg-royal-purple text-white shadow-lg shadow-royal-purple/20' : 'bg-white text-muted-text border border-luxury-border'}`}>
                    {step > s.id ? <Check size={18} /> : <s.icon size={18} />}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= s.id ? 'text-royal-purple' : 'text-muted-text'}`}>{s.title}</span>
                </div>
              ))}
            </div>

            {error && (
              <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 p-4 rounded-2xl text-sm">
                <AlertCircle size={18} className="flex-shrink-0" /> {error}
              </div>
            )}

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
                  <h2 className="text-2xl font-serif font-bold">Shipping Address</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Full Name" value={addr.fullName} onChange={v => set('fullName', v)} span2 />
                    <Field label="Phone Number" value={addr.phone} onChange={v => set('phone', v)} type="tel" />
                    <Field label="Email Address" value={addr.email} onChange={v => set('email', v)} type="email" />
                    <Field label="Address Line 1" value={addr.addressLine1} onChange={v => set('addressLine1', v)} span2 />
                    <Field label="Address Line 2 (Optional)" value={addr.addressLine2} onChange={v => set('addressLine2', v)} span2 />
                    <Field label="City" value={addr.city} onChange={v => set('city', v)} />
                    <Field label="State" value={addr.state} onChange={v => set('state', v)} />
                    <Field label="PIN Code" value={addr.pincode} onChange={v => set('pincode', v)} type="tel" span2 />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
                  <h2 className="text-2xl font-serif font-bold mb-6">Payment Method</h2>

                  <div className="flex flex-col gap-4">
                    {PAYMENT_METHODS.map(m => (
                      <button key={m} onClick={() => setPayment(m)}
                        className={`bg-white border-2 p-6 rounded-3xl flex items-center gap-4 text-left transition-all ${payment === m ? m === 'Order via WhatsApp' ? 'border-[#25D366] shadow-md' : 'border-royal-purple shadow-md' : 'border-luxury-border hover:border-royal-purple/30'}`}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${payment === m ? m === 'Order via WhatsApp' ? 'border-[#25D366]' : 'border-royal-purple' : 'border-luxury-border'}`}>
                          {payment === m && <div className={`w-2.5 h-2.5 rounded-full ${m === 'Order via WhatsApp' ? 'bg-[#25D366]' : 'bg-royal-purple'}`} />}
                        </div>
                        <span className="font-bold">{m}</span>
                        {m === 'Order via WhatsApp' && (
                          <span className="ml-auto flex items-center gap-1 text-xs text-muted-text">
                            <MessageCircle size={14} className="text-[#25D366]" /> Fast Order
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right — order summary (desktop) */}
          <div className="hidden lg:block w-96">
            <div className="bg-white rounded-[32px] p-8 border border-luxury-border sticky top-32">
              <h2 className="text-xl font-serif font-bold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-1">
                {cart.map(item => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4">
                    <div className="relative w-16 h-20 flex-shrink-0 rounded-xl overflow-hidden">
                      <Image src={getImage(item)} alt={item.name} fill sizes="64px" className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold truncate">{item.name}</h4>
                      <p className="text-xs text-muted-text">Size: {item.selectedSize} · Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-royal-purple mt-1">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4 pt-6 border-t border-luxury-border">
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span>Total</span><span className="text-royal-purple">₹{total.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-8">
                <ActionBtn
                  step={step}
                  handleNext={handleNext}
                  handlePlace={handlePlace}
                  processing={processing}
                  payment={payment}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass p-6 pb-10 border-t border-luxury-border">
        <ActionBtn
          mobile
          step={step}
          handleNext={handleNext}
          handlePlace={handlePlace}
          processing={processing}
          payment={payment}
        />
      </div>
    </div>
  );
}


import React, { useState, useMemo } from 'react';
import { IMAGE_LINKS, SHIRT_PRICE, SHIPPING_COST, SIZES, ICONS } from '../constants';
import { BookingFormData, ShirtQuantities } from '../types';
import { submitBooking } from '../services/googleSheets';

const initialQuantities: ShirtQuantities = {
  ss: 0, s: 0, m: 0, l: 0, xl: 0, '2xl': 0, '3xl': 0, '4xl': 0, '5xl': 0
};

export const ShirtBookingForm: React.FC = () => {
  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    school: '',
    phone: '',
    quantities: initialQuantities,
    shipping: 'pickup',
    address: '',
    slipFile: null
  });

  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalQuantity = useMemo(() => {
    return (Object.values(formData.quantities) as number[]).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
  }, [formData.quantities]);

  const totalPrice = useMemo(() => {
    const shirtTotal = totalQuantity * SHIRT_PRICE;
    const shippingTotal = formData.shipping === 'delivery' ? SHIPPING_COST : 0;
    return shirtTotal > 0 ? shirtTotal + shippingTotal : 0;
  }, [totalQuantity, formData.shipping]);

  const handleQuantityChange = (size: keyof ShirtQuantities, value: string) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    setFormData(prev => ({
      ...prev,
      quantities: { ...prev.quantities, [size]: numValue }
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    let formatted = val;
    if (val.length > 3 && val.length <= 6) {
      formatted = val.slice(0, 3) + '-' + val.slice(3);
    } else if (val.length > 6) {
      formatted = val.slice(0, 3) + '-' + val.slice(3, 6) + '-' + val.slice(6);
    }
    setFormData(prev => ({ ...prev, phone: formatted }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
         // @ts-ignore
         Swal.fire('ไฟล์ใหญ่เกินไป', 'กรุณาอัปโหลดรูปภาพขนาดไม่เกิน 5MB', 'error');
         return;
      }
      setFormData(prev => ({ ...prev, slipFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreviews([reader.result as string]);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totalQuantity === 0 || !formData.slipFile || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await submitBooking(formData);
      setFormData({
        fullName: '', school: '', phone: '',
        quantities: initialQuantities,
        shipping: 'pickup', address: '', slipFile: null
      });
      setPreviews([]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
        <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-3">
          <div className="w-2 h-8 bg-green-500 rounded-full"></div>
          ภาพตัวอย่างเสื้อชมรม
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[IMAGE_LINKS.shirt1, IMAGE_LINKS.shirt2, IMAGE_LINKS.shirt3].map((img, i) => (
            <div key={i} className="aspect-[4/5] bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all border group">
               <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-10">
          <div className="flex items-center justify-between border-b pb-6">
            <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3">
              <ICONS.CheckCircle className="text-green-600 w-8 h-8" />
              กรอกข้อมูลการจอง
            </h2>
            <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-bold">ราคาตัวละ {SHIRT_PRICE}.-</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600 flex items-center gap-2">ชื่อ-นามสกุล <span className="text-red-500">*</span></label>
              <input required type="text" value={formData.fullName} onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))} className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-green-500 transition-all text-lg" placeholder="ระบุชื่อจริง-นามสกุล" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600">โรงเรียน/หน่วยงาน <span className="text-red-500">*</span></label>
              <input required type="text" value={formData.school} onChange={e => setFormData(prev => ({ ...prev, school: e.target.value }))} className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-green-500 transition-all text-lg" placeholder="ระบุชื่อโรงเรียน" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600">เบอร์โทรติดต่อ <span className="text-red-500">*</span></label>
              <input required type="tel" value={formData.phone} onChange={handlePhoneChange} className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-green-500 transition-all text-lg" placeholder="08X-XXX-XXXX" />
            </div>
          </div>

          <div className="space-y-6">
            <label className="text-sm font-bold text-gray-600 border-l-4 border-green-500 pl-4">ระบุจำนวนแต่ละไซส์ (ตัว)</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-4">
              {SIZES.map(size => (
                <div key={size} className="space-y-2">
                  <div className="text-center py-2 bg-gray-800 text-white rounded-t-xl text-[10px] font-black uppercase tracking-widest">{size}</div>
                  <input type="number" min="0" value={formData.quantities[size as keyof ShirtQuantities] || ''} onChange={e => handleQuantityChange(size as keyof ShirtQuantities, e.target.value)} className="w-full text-center py-4 border-2 border-gray-100 rounded-b-xl focus:border-green-500 focus:ring-0 transition-all font-bold text-xl" placeholder="0" />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <label className="text-sm font-bold text-gray-600">ช่องทางการรับเสื้อ <span className="text-red-500">*</span></label>
              <div className="space-y-4">
                <label className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all ${formData.shipping === 'pickup' ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-4">
                    <input type="radio" checked={formData.shipping === 'pickup'} onChange={() => setFormData(prev => ({ ...prev, shipping: 'pickup', address: '' }))} className="w-5 h-5 accent-green-600" />
                    <div><p className="font-bold text-gray-800">รับด้วยตัวเอง</p><p className="text-xs text-gray-500">ณ สำนักงานเขตฯ</p></div>
                  </div>
                  <span className="font-bold text-green-600">ฟรี</span>
                </label>
                <label className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all ${formData.shipping === 'delivery' ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-4">
                    <input type="radio" checked={formData.shipping === 'delivery'} onChange={() => setFormData(prev => ({ ...prev, shipping: 'delivery' }))} className="w-5 h-5 accent-green-600" />
                    <div><p className="font-bold text-gray-800">ส่งไปรษณีย์</p><p className="text-xs text-gray-500">ส่งถึงที่อยู่</p></div>
                  </div>
                  <span className="font-bold text-green-600">+{SHIPPING_COST}.-</span>
                </label>
              </div>
              {formData.shipping === 'delivery' && (
                <textarea required rows={3} value={formData.address} onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))} className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-green-500 transition-all" placeholder="ระบุที่อยู่จัดส่งโดยละเอียด..." />
              )}
            </div>

            <div className="space-y-6">
              <label className="text-sm font-bold text-gray-600">หลักฐานการโอนเงิน <span className="text-red-500">*</span></label>
              <div className={`relative h-56 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all ${formData.slipFile ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                {previews.length > 0 ? (
                  <div className="relative w-full h-full p-4">
                    <img src={previews[0]} className="w-full h-full object-contain rounded-xl" />
                    <button type="button" onClick={() => { setFormData(prev => ({ ...prev, slipFile: null })); setPreviews([]); }} className="absolute -top-3 -right-3 bg-red-500 text-white w-8 h-8 rounded-full shadow-lg flex items-center justify-center font-bold">×</button>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <ICONS.Upload className="w-12 h-12 text-gray-300 mx-auto" />
                    <p className="text-sm text-gray-400 font-medium">กดเพื่อเลือกไฟล์รูปภาพ</p>
                    <p className="text-[10px] text-gray-300 uppercase tracking-widest">Max 5MB (JPG/PNG)</p>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                 <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                   <strong>ธนาคารกรุงไทย:</strong> 665-4-23587-8 (มข.)<br/>
                   <strong>ชื่อบัญชี:</strong> ชมรมครูนักวิจัย ขอนแก่น
                 </p>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t flex flex-col items-center gap-8">
            <div className="w-full max-w-md bg-slate-900 text-white rounded-3xl p-8 space-y-4 shadow-2xl transform hover:scale-[1.02] transition-transform">
              <div className="flex justify-between items-center"><span className="text-gray-400">จำนวนทั้งหมด</span><span className="text-xl font-bold">{totalQuantity} ตัว</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-400">ค่าจัดส่ง</span><span className="text-xl font-bold">{(formData.shipping === 'delivery' ? SHIPPING_COST : 0)}.-</span></div>
              <div className="h-px bg-white/10 my-4"></div>
              <div className="flex justify-between items-center"><span className="text-lg font-bold">ยอดสุทธิ</span><span className="text-3xl font-black text-green-400">{totalPrice.toLocaleString()}.-</span></div>
            </div>
            
            <button type="submit" disabled={totalQuantity === 0 || !formData.slipFile || isSubmitting} className={`w-full max-w-md py-6 rounded-full font-black text-xl shadow-2xl transition-all flex items-center justify-center gap-3 ${totalQuantity > 0 && formData.slipFile && !isSubmitting ? 'bg-green-600 hover:bg-green-500 active:scale-95 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
              {isSubmitting ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <ICONS.CheckCircle className="w-6 h-6" />}
              {isSubmitting ? 'กำลังส่งข้อมูล...' : 'ยืนยันสั่งจองเสื้อ'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

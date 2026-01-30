
import React, { useState, useEffect } from 'react';
import { fetchBookings } from '../services/googleSheets';
import { BookingRecord, ShirtQuantities } from '../types';
import { ICONS } from '../constants';

export const BookingStatus: React.FC = () => {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchBookings();
        setBookings(data);
      } catch (error) {
        console.error("Failed to load bookings", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredBookings = bookings.filter(b => 
    (b.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (b.school || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.phone || "").includes(searchTerm)
  );

  const renderSizeDetails = (sizes: ShirtQuantities) => {
    if (!sizes || typeof sizes !== 'object') return <span className="text-gray-400">-</span>;
    
    const sizeKeys = ['ss', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'];
    
    const activeSizes = sizeKeys
      .filter(key => {
        const qty = (sizes as any)[key];
        return qty !== undefined && qty !== null && Number(qty) > 0;
      })
      .map(key => (
        <span key={key} className="inline-block bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-100 mr-1 mb-1 text-[10px] font-bold">
          {key.toUpperCase()}: {(sizes as any)[key]}
        </span>
      ));
    
    return activeSizes.length > 0 ? activeSizes : <span className="text-gray-400">-</span>;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-800">ตรวจสอบข้อมูลการจอง</h2>
            <p className="text-sm text-gray-500">ค้นหาด้วยชื่อ-นามสกุล หรือชื่อโรงเรียน</p>
          </div>
          <div className="relative w-full md:w-80">
            <ICONS.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ค้นหา..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            <p className="text-gray-500 text-sm font-medium">กำลังโหลดข้อมูลล่าสุด...</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">ผู้จอง</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">โรงเรียน</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">รายละเอียดที่จอง</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">รวม (ตัว)</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">สถานะการชำระเงิน</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">สถานะการส่ง</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((b, idx) => (
                    <tr key={idx} className="hover:bg-green-50/50 transition-colors">
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="font-semibold text-gray-800">{b.fullName || "-"}</div>
                        <div className="text-[10px] text-gray-400 font-mono">{b.timestamp || ""}</div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">{b.school || "-"}</td>
                      <td className="px-6 py-5 text-xs font-medium max-w-xs break-words">
                        <div className="flex flex-wrap">
                          {renderSizeDetails(b.sizes)}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-center font-bold text-gray-700">{b.totalShirts}</td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <StatusBadge type="payment" status={b.paymentStatus} />
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <StatusBadge type="shipping" status={b.shippingStatus} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-gray-400">
                      ไม่พบข้อมูลการจองในระบบ
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{ type: 'payment' | 'shipping', status: string }> = ({ type, status }) => {
  const isComplete = (status || "").includes('เรียบร้อย') || (status || "").includes('ได้รับ');
  
  const colors = isComplete 
    ? 'bg-green-100 text-green-700 border-green-200' 
    : 'bg-amber-100 text-amber-700 border-amber-200';

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${colors}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 animate-pulse"></span>
      {status || (type === 'payment' ? 'รอตรวจสอบ' : 'รอจัดส่ง')}
    </div>
  );
};

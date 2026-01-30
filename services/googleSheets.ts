
import { BookingFormData, BookingRecord } from '../types';
import { SCRIPT_URL } from '../constants';

declare var Swal: any;

export async function submitBooking(data: BookingFormData): Promise<any> {
  Swal.fire({
    title: 'กำลังบันทึกข้อมูล...',
    text: 'กรุณารอสักครู่ ระบบกำลังอัปโหลดสลิป',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  });

  try {
    const fileBase64 = data.slipFile ? await fileToBase64(data.slipFile) : '';
    
    const payload = {
      fullName: data.fullName,
      school: data.school,
      phone: data.phone,
      quantities: data.quantities,
      shipping: data.shipping,
      address: data.address,
      slip: fileBase64,
      fileName: data.slipFile?.name || 'slip.jpg',
      mimeType: data.slipFile?.type || 'image/jpeg'
    };

    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify(payload)
    });

    await new Promise(resolve => setTimeout(resolve, 3000));

    Swal.fire({
      icon: 'success',
      title: 'บันทึกสำเร็จ!',
      text: 'ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว',
      confirmButtonColor: '#16a34a'
    });

    return { success: true };
  } catch (error: any) {
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: error.message
    });
    throw error;
  }
}

export async function fetchBookings(): Promise<BookingRecord[]> {
  return new Promise((resolve, reject) => {
    const callbackName = 'jsonp_cb_' + Date.now();
    const script = document.createElement('script');
    
    (window as any)[callbackName] = (res: any) => {
      document.body.removeChild(script);
      delete (window as any)[callbackName];
      resolve(res.data || []);
    };

    script.src = `${SCRIPT_URL}?action=getList&callback=${callbackName}`;
    document.body.appendChild(script);
  });
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
  });
}

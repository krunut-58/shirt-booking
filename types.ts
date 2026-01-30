
export interface ShirtQuantities {
  ss: number;
  s: number;
  m: number;
  l: number;
  xl: number;
  '2xl': number;
  '3xl': number;
  '4xl': number;
  '5xl': number;
}

export type ShippingType = 'pickup' | 'delivery';

export interface BookingFormData {
  fullName: string;
  school: string;
  phone: string;
  quantities: ShirtQuantities;
  shipping: ShippingType;
  address: string;
  slipFile?: File | null;
}

export interface BookingRecord {
  timestamp: string;
  fullName: string;
  school: string;
  phone: string;
  totalShirts: number;
  sizes: ShirtQuantities;
  paymentStatus: string;
  shippingStatus: string;
}

export enum View {
  BOOKING = 'booking',
  STATUS = 'status'
}

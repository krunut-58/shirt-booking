
import React, { useState } from 'react';
import { ShirtBookingForm } from './components/ShirtBookingForm';
import { BookingStatus } from './components/BookingStatus';
import { Layout } from './components/Layout';
import { View } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<View>(View.BOOKING);

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      {currentView === View.BOOKING ? <ShirtBookingForm /> : <BookingStatus />}
    </Layout>
  );
}

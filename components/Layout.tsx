
import React from 'react';
import { View } from '../types';
import { ICONS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  onNavigate: (view: View) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 p-2 rounded-lg shadow-sm">
              <ICONS.Package className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">ชมรมครูนักวิจัย ขอนแก่น</h1>
          </div>
          <nav className="flex gap-2 bg-gray-100 p-1 rounded-full">
            <button
              onClick={() => onNavigate(View.BOOKING)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                currentView === View.BOOKING ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              จองเสื้อ
            </button>
            <button
              onClick={() => onNavigate(View.STATUS)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                currentView === View.STATUS ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              ตรวจสอบสถานะ
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-white border-t py-6 text-center">
        <p className="text-gray-400 text-sm">© 2567 ชมรมครูนักวิจัย ขอนแก่น. All rights reserved.</p>
      </footer>
    </div>
  );
};

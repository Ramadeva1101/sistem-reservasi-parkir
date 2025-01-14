import React from 'react';

function HowItWorks() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Cara Kerja</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-blue-600">1</span>
          </div>
          <h3 className="text-xl font-semibold mb-4">Daftar</h3>
          <p className="text-gray-600">
            Buat akun baru dengan mengisi data diri Anda
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-blue-600">2</span>
          </div>
          <h3 className="text-xl font-semibold mb-4">Cari Lokasi</h3>
          <p className="text-gray-600">
            Pilih lokasi parkir yang sesuai dengan tujuan Anda
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-blue-600">3</span>
          </div>
          <h3 className="text-xl font-semibold mb-4">Reservasi</h3>
          <p className="text-gray-600">
            Pilih waktu dan lakukan pembayaran untuk reservasi
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-blue-600">4</span>
          </div>
          <h3 className="text-xl font-semibold mb-4">Parkir</h3>
          <p className="text-gray-600">
            Tunjukkan kode QR saat masuk area parkir
          </p>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;
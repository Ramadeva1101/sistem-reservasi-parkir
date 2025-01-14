import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

function Home() {
  return (
    <>
      {/* Hero Section dengan gradient yang lebih konsisten */}
      <div className="relative bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Sistem Reservasi Parkir Online
            </h1>
            <p className="text-xl text-gray-200 mb-12">
              Temukan dan reservasi tempat parkir dengan mudah dan cepat
            </p>
            <Link 
              to="/register" 
              className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition duration-300"
            >
              Mulai Sekarang
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section dengan background yang lebih konsisten */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Fitur Utama
            </h2>
            <p className="mt-4 text-xl text-gray-600">Nikmati kemudahan dalam mengelola parkir Anda</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature cards dengan efek glassmorphism */}
            <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 border border-gray-100">
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500 mb-4">
                <i className="fas fa-search text-4xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Cari Parkir</h3>
              <p className="text-gray-600">
                Temukan lokasi parkir terdekat dengan fitur pencarian yang mudah dan akurat
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 border border-gray-100">
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500 mb-4">
                <i className="fas fa-calendar-alt text-4xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Reservasi Online</h3>
              <p className="text-gray-600">
                Booking tempat parkir secara online kapan saja dan dimana saja
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 border border-gray-100">
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500 mb-4">
                <i className="fas fa-shield-alt text-4xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Pembayaran Aman</h3>
              <p className="text-gray-600">
                Transaksi aman dengan berbagai metode pembayaran yang tersedia
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section dengan background yang lebih konsisten */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Cara Kerja
            </h2>
            <p className="mt-4 text-xl text-gray-600">Mudah dan cepat dalam 3 langkah</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step cards dengan animasi hover */}
            <div className="text-center transform hover:-translate-y-2 transition duration-300">
              <div className="bg-gradient-to-br from-blue-400 to-indigo-400 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Pilih Lokasi</h3>
              <p className="text-gray-600">Cari dan pilih lokasi parkir yang tersedia</p>
            </div>

            <div className="text-center transform hover:-translate-y-2 transition duration-300">
              <div className="bg-gradient-to-br from-blue-400 to-indigo-400 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Reservasi</h3>
              <p className="text-gray-600">Pilih waktu dan lakukan reservasi</p>
            </div>

            <div className="text-center transform hover:-translate-y-2 transition duration-300">
              <div className="bg-gradient-to-br from-blue-400 to-indigo-400 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Parkir</h3>
              <p className="text-gray-600">Datang dan parkir sesuai waktu reservasi</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Home;
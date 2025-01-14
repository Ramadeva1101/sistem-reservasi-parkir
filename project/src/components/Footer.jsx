import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Tentang Kami</h3>
            <p className="text-gray-400 text-sm">
              Sistem Parkir Online adalah solusi modern untuk manajemen parkir yang efisien dan mudah digunakan.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Layanan</h3>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>Reservasi Parkir</li>
              <li>Manajemen Parkir</li>
              <li>Pembayaran Online</li>
              <li>24/7 Support</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontak</h3>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>Email: info@parkir.com</li>
              <li>Phone: (021) 1234-5678</li>
              <li>WhatsApp: 0812-3456-7890</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Ikuti Kami</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Instagram</span>
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <i className="fab fa-twitter text-xl"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
          © 2024 Sistem Parkir Online. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer; 
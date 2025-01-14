import React from 'react';

function Rates() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Tarif Parkir</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Tarif Reguler</h3>
          <ul className="space-y-3">
            <li className="flex justify-between">
              <span>1 Jam Pertama</span>
              <span className="font-medium">Rp 5.000</span>
            </li>
            <li className="flex justify-between">
              <span>Per Jam Berikutnya</span>
              <span className="font-medium">Rp 3.000</span>
            </li>
            <li className="flex justify-between">
              <span>Maksimal per Hari</span>
              <span className="font-medium">Rp 50.000</span>
            </li>
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Tarif VIP</h3>
          <ul className="space-y-3">
            <li className="flex justify-between">
              <span>1 Jam Pertama</span>
              <span className="font-medium">Rp 10.000</span>
            </li>
            <li className="flex justify-between">
              <span>Per Jam Berikutnya</span>
              <span className="font-medium">Rp 7.000</span>
            </li>
            <li className="flex justify-between">
              <span>Maksimal per Hari</span>
              <span className="font-medium">Rp 100.000</span>
            </li>
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Tarif Bulanan</h3>
          <ul className="space-y-3">
            <li className="flex justify-between">
              <span>1 Bulan Regular</span>
              <span className="font-medium">Rp 750.000</span>
            </li>
            <li className="flex justify-between">
              <span>1 Bulan VIP</span>
              <span className="font-medium">Rp 1.500.000</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Rates;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ReservationModal from '../components/ReservationModal';

const mallData = [
  {
    id: 1,
    name: 'Grand Indonesia',
    address: 'Jl. M.H. Thamrin No.1, Jakarta Pusat',
    image: 'https://source.unsplash.com/800x600/?mall',
    totalSpots: 500,
    availableSpots: 125,
    rate_car: 5000,
    rate_motorcycle: 2000
  },
  {
    id: 2,
    name: 'Plaza Indonesia',
    address: 'Jl. M.H. Thamrin Kav. 28-30, Jakarta Pusat',
    image: 'https://source.unsplash.com/800x600/?shopping',
    totalSpots: 400,
    availableSpots: 80,
    rate_car: 5000,
    rate_motorcycle: 2000
  },
  {
    id: 3,
    name: 'Mall Taman Anggrek',
    address: 'Jl. Letjen S. Parman Kav. 21, Jakarta Barat',
    image: 'https://source.unsplash.com/800x600/?building',
    totalSpots: 600,
    availableSpots: 200,
    rate_car: 5000,
    rate_motorcycle: 2000
  },
  {
    id: 4,
    name: 'Central Park',
    address: 'Jl. Letjen S. Parman Kav. 28, Jakarta Barat',
    image: 'https://source.unsplash.com/800x600/?city',
    totalSpots: 450,
    availableSpots: 150,
    rate_car: 5000,
    rate_motorcycle: 2000
  },
  {
    id: 5,
    name: 'Mall Kelapa Gading',
    address: 'Jl. Bulevar Kelapa Gading, Jakarta Utara',
    image: 'https://source.unsplash.com/800x600/?architecture',
    totalSpots: 550,
    availableSpots: 175,
    rate_car: 5000,
    rate_motorcycle: 2000
  },
  {
    id: 6,
    name: 'Pondok Indah Mall',
    address: 'Jl. Metro Pondok Indah, Jakarta Selatan',
    image: 'https://source.unsplash.com/800x600/?store',
    totalSpots: 480,
    availableSpots: 160,
    rate_car: 5000,
    rate_motorcycle: 2000
  }
];

function Locations() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMall, setSelectedMall] = useState(null);

  const handleReservationClick = (mall) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedMall(mall);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mall Parkir</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mallData.map((mall) => (
          <div key={mall.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={mall.image}
              alt={mall.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900">{mall.name}</h2>
              <p className="mt-2 text-gray-600">{mall.address}</p>
              <div className="mt-4 flex justify-between text-sm text-gray-500">
                <span>Total Spots: {mall.totalSpots}</span>
                <span>Available: {mall.availableSpots}</span>
              </div>
              <button
                onClick={() => handleReservationClick(mall)}
                className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {user ? 'Reservasi Sekarang' : 'Login untuk Reservasi'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedMall && (
        <ReservationModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedMall(null);
          }}
          mall={selectedMall}
          userId={user?.id}
        />
      )}
    </div>
  );
}

export default Locations;
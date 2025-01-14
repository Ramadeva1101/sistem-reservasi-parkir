import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import ParkingSlotSelector from './ParkingSlotSelector';

const mallData = [
  {
    id: 1,
    name: 'Grand Indonesia',
    address: 'Jl. M.H. Thamrin No.1, Jakarta Pusat',
    rate_car: 5000,
    rate_motorcycle: 2000,
    totalSpots: 500,
    availableSpots: 125
  },
  {
    id: 2,
    name: 'Plaza Indonesia',
    address: 'Jl. M.H. Thamrin Kav. 28-30, Jakarta Pusat',
    rate_car: 5000,
    rate_motorcycle: 2000,
    totalSpots: 400,
    availableSpots: 80
  },
  {
    id: 3,
    name: 'Mall Taman Anggrek',
    address: 'Jl. Letjen S. Parman Kav. 21, Jakarta Barat',
    rate_car: 5000,
    rate_motorcycle: 2000,
    totalSpots: 300,
    availableSpots: 120
  }
];

function ReservationForm({ onSuccess }) {
  const { user } = useAuth();
  const [showSlotSelector, setShowSlotSelector] = useState(false);
  const [bookedSlots] = useState(['10102', '10103', '10205']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    mall_id: '',
    parking_slot: '',
    start_time: '',
    vehicle_type: 'mobil',
    plate_number: '',
    duration: 1,
    payment_status: 'pending'
  });

  const calculateTotalCost = () => {
    const selectedMall = mallData.find(m => m.id === parseInt(formData.mall_id));
    if (!selectedMall) return 0;
    const rate = formData.vehicle_type === 'mobil' ? selectedMall.rate_car : selectedMall.rate_motorcycle;
    return rate * formData.duration;
  };

  const calculateEndTime = (startTime, durationHours) => {
    if (!startTime) return '';
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + parseInt(durationHours));
    return endTime.toISOString().slice(0, 16); // Format: "YYYY-MM-DDTHH:mm"
  };

  const getMinDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const startTime = new Date(formData.start_time);
      const endTime = new Date(startTime.getTime() + formData.duration * 60 * 60 * 1000);

      const reservationData = {
        ...formData,
        user_id: user.id,
        end_time: endTime.toISOString(),
        total_cost: calculateTotalCost()
      };

      console.log('Reservation Data:', reservationData);

      await axios.post('http://localhost:3002/api/reservations/create', reservationData);
      if (onSuccess) {
        onSuccess();
      }
      // Reset form
      setFormData({
        mall_id: '',
        parking_slot: '',
        start_time: '',
        vehicle_type: 'mobil',
        plate_number: '',
        duration: 1,
        payment_status: 'pending'
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Gagal membuat reservasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {error && (
        <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Mall</label>
            <select
              value={formData.mall_id}
              onChange={(e) => setFormData({...formData, mall_id: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Pilih Mall</option>
              {mallData.map((mall) => (
                <option key={mall.id} value={mall.id}>
                  {mall.name} ({mall.availableSpots} slot tersedia)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Slot Parkir</label>
            <div className="mt-1 flex">
              <input
                type="text"
                value={formData.parking_slot}
                readOnly
                className="block w-full rounded-l-md border-gray-300 bg-gray-50"
                placeholder="Pilih slot parkir"
              />
              <button
                type="button"
                onClick={() => setShowSlotSelector(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
              >
                Pilih
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Waktu Mulai</label>
            <input
              type="datetime-local"
              value={formData.start_time}
              min={getMinDateTime()}
              onChange={(e) => setFormData({
                ...formData,
                start_time: e.target.value,
                end_time: calculateEndTime(e.target.value, formData.duration)
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Waktu Selesai</label>
            <input
              type="datetime-local"
              value={calculateEndTime(formData.start_time, formData.duration)}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Durasi (jam)</label>
            <select
              value={formData.duration}
              onChange={(e) => setFormData({
                ...formData,
                duration: e.target.value,
                end_time: calculateEndTime(formData.start_time, e.target.value)
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((hours) => (
                <option key={hours} value={hours}>{hours} jam</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Jenis Kendaraan</label>
            <select
              value={formData.vehicle_type}
              onChange={(e) => setFormData({...formData, vehicle_type: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="mobil">Mobil</option>
              <option value="motor">Motor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nomor Plat</label>
            <input
              type="text"
              value={formData.plate_number}
              onChange={(e) => setFormData({...formData, plate_number: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="B 1234 ABC"
              required
            />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium text-gray-900 mb-2">Ringkasan Biaya</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Biaya per jam</span>
              <span>
                {formData.mall_id ? 
                  `Rp ${(formData.vehicle_type === 'mobil' ? 
                    mallData.find(m => m.id === parseInt(formData.mall_id))?.rate_car : 
                    mallData.find(m => m.id === parseInt(formData.mall_id))?.rate_motorcycle
                  ).toLocaleString()}` : 
                  'Pilih mall terlebih dahulu'
                }
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Durasi</span>
              <span>{formData.duration} jam</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>Rp {calculateTotalCost().toLocaleString()}</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Memproses...' : 'Buat Reservasi'}
        </button>
      </form>

      <ParkingSlotSelector
        isOpen={showSlotSelector}
        onClose={() => setShowSlotSelector(false)}
        selectedSlot={formData.parking_slot}
        onSelectSlot={(slot) => {
          setFormData({...formData, parking_slot: slot});
          setShowSlotSelector(false);
        }}
        bookedSlots={bookedSlots}
      />
    </div>
  );
}

export default ReservationForm; 
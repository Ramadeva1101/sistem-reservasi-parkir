import React, { useState } from 'react';
import axios from 'axios';
import ParkingSlotSelector from './ParkingSlotSelector';

function ReservationModal({ isOpen, onClose, mall, userId }) {
  const [showSlotSelector, setShowSlotSelector] = useState(false);
  const [formData, setFormData] = useState({
    mall_id: mall?.id || '',
    parking_slot: '',
    start_time: '',
    vehicle_type: 'mobil',
    plate_number: '',
    duration: 1,
    payment_status: 'pending'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookedSlots] = useState(['10102', '10103', '10205']);

  if (!isOpen) return null;

  const calculateTotalCost = () => {
    const rate = formData.vehicle_type === 'mobil' ? mall.rate_car : mall.rate_motorcycle;
    return rate * formData.duration;
  };

  const calculateEndTime = (startTime, durationHours) => {
    if (!startTime) return '';
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + parseInt(durationHours));
    return endTime.toISOString().slice(0, 16);
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
        mall_id: mall.id,
        user_id: userId,
        end_time: endTime.toISOString(),
        total_cost: calculateTotalCost()
      };

      await axios.post('http://localhost:3002/api/reservations/create', reservationData);
      onClose();
      alert('Reservasi berhasil dibuat! Silakan lakukan pembayaran.');
    } catch (error) {
      setError(error.response?.data?.message || 'Terjadi kesalahan saat membuat reservasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Reservasi - {mall.name}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slot Parkir
            </label>
            <div className="flex">
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Waktu Mulai
              </label>
              <input
                type="datetime-local"
                value={formData.start_time}
                min={getMinDateTime()}
                onChange={(e) => setFormData({
                  ...formData,
                  start_time: e.target.value,
                  end_time: calculateEndTime(e.target.value, formData.duration)
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Waktu Selesai
              </label>
              <input
                type="datetime-local"
                value={calculateEndTime(formData.start_time, formData.duration)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durasi (jam)
              </label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((hours) => (
                  <option key={hours} value={hours}>{hours} jam</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Kendaraan
              </label>
              <select
                value={formData.vehicle_type}
                onChange={(e) => setFormData({...formData, vehicle_type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="mobil">Mobil</option>
                <option value="motor">Motor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nomor Plat
              </label>
              <input
                type="text"
                placeholder="B 1234 ABC"
                value={formData.plate_number}
                onChange={(e) => setFormData({...formData, plate_number: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium text-gray-900 mb-2">Ringkasan Biaya</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Biaya per jam</span>
                <span>Rp {formData.vehicle_type === 'mobil' ? mall.rate_car.toLocaleString() : mall.rate_motorcycle.toLocaleString()}</span>
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

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-4 py-2 rounded-md text-white ${
                loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Memproses...' : 'Konfirmasi'}
            </button>
          </div>
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
    </div>
  );
}

export default ReservationModal;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ManagerDashboard() {
  const [reservations, setReservations] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState({});

  // Fetch data function
  const fetchData = async () => {
    try {
      const [reservationsRes, statsRes] = await Promise.all([
        axios.get('http://localhost:3002/api/manager/reservations'),
        axios.get('http://localhost:3002/api/manager/payment-statistics')
      ]);
      setReservations(reservationsRes.data);
      setStatistics(statsRes.data);
      setLoading(false);
    } catch (error) {
      setError('Gagal mengambil data');
      console.error('Error:', error);
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = (reservationId, status) => {
    setSelectedStatus({
      ...selectedStatus,
      [reservationId]: status
    });
  };

  const handleSubmitStatus = async (reservationId) => {
    try {
      const status = selectedStatus[reservationId];

      if (!status) {
        alert('Pilih status pembayaran terlebih dahulu');
        return;
      }

      await axios.put(`http://localhost:3002/api/manager/reservations/${reservationId}/payment`, {
        payment_status: status
      });

      // Refresh semua data setelah update
      await fetchData();

      // Reset selected status
      setSelectedStatus({
        ...selectedStatus,
        [reservationId]: ''
      });

      alert('Status pembayaran berhasil diupdate');
    } catch (error) {
      console.error('Error updating payment:', error);
      alert('Gagal mengupdate status pembayaran');
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Total Reservasi</h3>
          <p className="text-2xl font-bold">{statistics?.total_reservations || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Menunggu Pembayaran</h3>
          <p className="text-2xl font-bold">{statistics?.pending_payments || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Sudah Dibayar</h3>
          <p className="text-2xl font-bold">{statistics?.paid_payments || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Total Pendapatan</h3>
          <p className="text-2xl font-bold">Rp {statistics?.total_revenue?.toLocaleString() || 0}</p>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slot
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Waktu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status Saat Ini
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Update Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{reservation.user_name}</div>
                  <div className="text-sm text-gray-500">{reservation.user_email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{reservation.parking_slot}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(reservation.start_time).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(reservation.start_time).toLocaleTimeString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    Rp {reservation.total_cost.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${reservation.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 
                      reservation.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      reservation.payment_status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'}`}>
                    {reservation.payment_status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <select
                      className="text-sm border rounded p-2 w-40"
                      value={selectedStatus[reservation.id] || ''}
                      onChange={(e) => handleStatusChange(reservation.id, e.target.value)}
                    >
                      <option value="">Pilih Status</option>
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button
                      onClick={() => handleSubmitStatus(reservation.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
                    >
                      Submit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManagerDashboard;
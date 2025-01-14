import React from 'react';

function ParkingSlotSelector({ isOpen, onClose, selectedSlot, onSelectSlot, bookedSlots = [] }) {
  if (!isOpen) return null;

  const floors = [1, 2, 3];
  const slotsPerRow = 10;
  const rowsPerFloor = 5;

  const generateSlots = (floor) => {
    let slots = [];
    for (let row = 1; row <= rowsPerFloor; row++) {
      let rowSlots = [];
      for (let col = 1; col <= slotsPerRow; col++) {
        const slotNumber = `${floor}${String(row).padStart(2, '0')}${String(col).padStart(2, '0')}`;
        const isBooked = bookedSlots.includes(slotNumber);
        const isSelected = selectedSlot === slotNumber;
        const isAvailable = !isBooked;

        rowSlots.push(
          <button
            key={slotNumber}
            onClick={() => isAvailable && onSelectSlot(slotNumber)}
            disabled={!isAvailable}
            className={`
              w-10 h-10 m-1 rounded-md text-sm font-medium transition-colors
              ${isSelected ? 'bg-blue-600 text-white' : ''}
              ${isBooked ? 'bg-gray-300 cursor-not-allowed' : ''}
              ${isAvailable && !isSelected ? 'bg-green-100 hover:bg-green-200' : ''}
              border-2
              ${isSelected ? 'border-blue-700' : ''}
              ${isBooked ? 'border-gray-400' : ''}
              ${isAvailable && !isSelected ? 'border-green-400' : ''}
            `}
            title={`Slot ${slotNumber}`}
          >
            {col}
          </button>
        );
      }
      slots.push(
        <div key={`floor${floor}row${row}`} className="flex justify-center space-x-1">
          {rowSlots}
        </div>
      );
    }
    return slots;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Pilih Slot Parkir</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          <div className="space-y-8">
            {floors.map(floor => (
              <div key={floor} className="space-y-4">
                <h3 className="text-lg font-medium text-center">Lantai {floor}</h3>
                <div className="space-y-2">
                  {generateSlots(floor)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center space-x-4">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-green-100 border-2 border-green-400 rounded"></div>
            <span className="ml-2 text-sm">Tersedia</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-gray-300 border-2 border-gray-400 rounded"></div>
            <span className="ml-2 text-sm">Terisi</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-blue-600 border-2 border-blue-700 rounded"></div>
            <span className="ml-2 text-sm">Dipilih</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParkingSlotSelector; 
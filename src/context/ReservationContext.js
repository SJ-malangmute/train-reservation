import { createContext, useContext, useState } from 'react';

const ReservationContext = createContext();

export function ReservationProvider({ children }) {
  const [reservationData, setReservationData] = useState({
    trainType: '', // 'SRT' or 'KTX'
    departureStation: '',
    arrivalStation: '',
    date: null,
    time: '',
    passengerCount: 1,
    selectedTrains: []
  });

  const updateReservationData = (data) => {
    setReservationData(prev => ({ ...prev, ...data }));
  };

  return (
    <ReservationContext.Provider value={{ reservationData, updateReservationData }}>
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservation() {
  return useContext(ReservationContext);
} 
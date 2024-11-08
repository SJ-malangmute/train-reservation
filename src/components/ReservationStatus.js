import { useEffect, useState, useRef } from 'react';
import { Container, Typography, Box, CircularProgress, Paper, Alert } from '@mui/material';
import { useReservation } from '../context/ReservationContext';

function ReservationStatus() {
  const { reservationData } = useReservation();
  const [reservation, setReservation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const isReserving = useRef(false);  // 예매 진행 중인지 확인하는 ref

  useEffect(() => {
    const tryReservation = async () => {
      if (isReserving.current || reservation) return;
      
      isReserving.current = true;
      
      try {
        const response = await fetch('http://localhost:5000/api/reserve-train', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',  // 쿠키 전송 허용
          body: JSON.stringify({
            departure: reservationData.departureStation,
            arrival: reservationData.arrivalStation,
            date: reservationData.date,
            time: reservationData.time,
            selectedTrains: reservationData.selectedTrains,
            passengerCount: reservationData.passengerCount
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          setReservation(data.reservation);
        } else {
          throw new Error(data.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        isReserving.current = false;  // 예매 종료
      }
    };

    tryReservation();
  }, [reservationData, reservation]);

  const formatTime = (timeString) => {
    if (!timeString) return '-';
    const hour = timeString.substring(0, 2);
    const minute = timeString.substring(2, 4);
    return `${hour}:${minute}`;
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            예매 시도 중
          </Typography>
          <Paper sx={{ p: 3, mt: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <CircularProgress sx={{ alignSelf: 'center', mb: 2 }} />
              <Typography>
                선택하신 {reservationData.selectedTrains.length}개의 기차에 대해
                예매를 시도하고 있습니다.
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        </Box>
      </Container>
    );
  }

  if (reservation) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          <Alert severity="success" sx={{ mb: 2 }}>
            예매가 완료되었습니다!
          </Alert>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              예매 정보
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography>
                예매번호: {reservation.number}
              </Typography>
              <Typography>
                열차번호: {reservation.train_number}
              </Typography>
              <Typography>
                {reservation.dep_station} {formatTime(reservation.dep_time)} → {reservation.arr_station} {formatTime(reservation.arr_time)}
              </Typography>
              <Typography>
                결제금액: {reservation.price.toLocaleString()}원
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  }

  return null;
}

export default ReservationStatus; 
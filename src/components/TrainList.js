import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Checkbox, Button, Paper, CircularProgress } from '@mui/material';
import { useReservation } from '../context/ReservationContext';

function TrainList() {
  const navigate = useNavigate();
  const { reservationData, updateReservationData } = useReservation();
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/search-trains', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            departure: reservationData.departureStation,
            arrival: reservationData.arrivalStation,
            date: reservationData.date,
            time: reservationData.time,
            passengers: [{"type": "Adult", "count": reservationData.passengerCount}]
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          setTrains(data.trains);
        } else {
          throw new Error(data.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrains();
  }, [reservationData]);

  const handleTrainSelect = (index) => {
    const newSelectedTrains = reservationData.selectedTrains.includes(index)
      ? reservationData.selectedTrains.filter(id => id !== index)
      : [...reservationData.selectedTrains, index];
    
    updateReservationData({ selectedTrains: newSelectedTrains });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '-';
    const hour = timeString.substring(0, 2);
    const minute = timeString.substring(2, 4);
    return `${hour}:${minute}`;
  };

  const handleSubmit = () => {
    if (reservationData.selectedTrains.length > 0) {
      navigate('/status');  // ReservationStatus 페이지로 이동
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" sx={{ mt: 4 }}>
          에러가 발생했습니다: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom textAlign="center">
          예매 가능한 기차
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {trains.map((train, index) => (
            <Paper key={train.id} sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  checked={reservationData.selectedTrains.includes(index)}
                  onChange={() => handleTrainSelect(index)}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6">
                    {train.train_name} {train.id}
                  </Typography>
                  <Typography variant="h6">
                    {train.dep_station} {formatTime(train.dep_time)} → {train.arr_station} {formatTime(train.arr_time)}
                  </Typography>
                  {/* <Typography variant="body2" color="text.secondary">
                    {train.price.toLocaleString()}원
                  </Typography> */}
                  <Typography variant="body2" color={train.seats ? "success.main" : "error.main"}>
                    {train.seats ? "예매 가능" : "매진"}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))}
          
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={reservationData.selectedTrains.length === 0}
            sx={{ mt: 2, mb: 4 }}
          >
            예매하기
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default TrainList; 
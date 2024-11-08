import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button } from '@mui/material';
import { useReservation } from '../context/ReservationContext';

function PassengerCount() {
  const navigate = useNavigate();
  const { updateReservationData } = useReservation();

  const passengerCounts = Array.from({ length: 9 }, (_, i) => i + 1);

  const handlePassengerSelect = (count) => {
    updateReservationData({ passengerCount: count });
    navigate('/trains');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          승객 수 선택
        </Typography>
        <Box sx={{ mt: 4, display: 'grid', gap: 2, gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {passengerCounts.map((count) => (
            <Button
              key={count}
              variant="outlined"
              onClick={() => handlePassengerSelect(count)}
              sx={{ height: '60px' }}
            >
              {count}명
            </Button>
          ))}
        </Box>
      </Box>
    </Container>
  );
}

export default PassengerCount; 
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button } from '@mui/material';
import { useReservation } from '../context/ReservationContext';

function TimeSelection() {
  const navigate = useNavigate();
  const { updateReservationData } = useReservation();

  const times = Array.from({ length: 24 }, (_, i) => i);

  const handleTimeSelect = (hour) => {
    const formattedTime = `${hour.toString().padStart(2, '0')}0000`;
    updateReservationData({ time: formattedTime });
    navigate('/passengers');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          시간 선택
        </Typography>
        <Box sx={{ mt: 4, display: 'grid', gap: 2, gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {times.map((hour) => (
            <Button
              key={hour}
              variant="outlined"
              onClick={() => handleTimeSelect(hour)}
            >
              {`${hour.toString().padStart(2, '0')}:00`}
            </Button>
          ))}
        </Box>
      </Box>
    </Container>
  );
}

export default TimeSelection; 
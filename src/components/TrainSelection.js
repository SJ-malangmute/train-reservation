import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box } from '@mui/material';
import { useReservation } from '../context/ReservationContext';

function TrainSelection() {
  const navigate = useNavigate();
  const { updateReservationData } = useReservation();

  const handleTrainSelect = (trainType) => {
    updateReservationData({ trainType });
    navigate('/station');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          기차 예매 시스템
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          예매하실 기차를 선택해주세요
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => handleTrainSelect('KTX')}
          >
            KTX
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={() => handleTrainSelect('SRT')}
          >
            SRT
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default TrainSelection; 
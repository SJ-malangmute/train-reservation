import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Autocomplete, TextField, Button } from '@mui/material';
import { useReservation } from '../context/ReservationContext';

function StationSelection() {
  const navigate = useNavigate();
  const { reservationData, updateReservationData } = useReservation();

  // 임시 역 데이터 (실제로는 API에서 받아와야 함)
  const stations = reservationData.trainType === 'KTX' 
    ? ['서울', '대전', '동대구', '부산', '광주송정', '목포']
    : ['수서', '동탄', '평택지제', '천안아산', '오송', '대전', '동대구', '부산'];

  const handleSubmit = () => {
    if (reservationData.departureStation && reservationData.arrivalStation) {
      navigate('/date');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {reservationData.trainType} 역 선택
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Autocomplete
            options={stations}
            value={reservationData.departureStation}
            onChange={(_, newValue) => {
              updateReservationData({ departureStation: newValue });
            }}
            renderInput={(params) => (
              <TextField {...params} label="출발역" required />
            )}
          />
          <Autocomplete
            options={stations}
            value={reservationData.arrivalStation}
            onChange={(_, newValue) => {
              updateReservationData({ arrivalStation: newValue });
            }}
            renderInput={(params) => (
              <TextField {...params} label="도착역" required />
            )}
          />
          <Button 
            variant="contained" 
            size="large"
            onClick={handleSubmit}
            disabled={!reservationData.departureStation || !reservationData.arrivalStation}
          >
            다음
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default StationSelection; 
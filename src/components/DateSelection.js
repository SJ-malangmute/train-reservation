import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button } from '@mui/material';
import { useReservation } from '../context/ReservationContext';
import { addDays, format } from 'date-fns';
import { ko } from 'date-fns/locale';

function DateSelection() {
  const navigate = useNavigate();
  const { updateReservationData } = useReservation();

  // 오늘부터 2주간의 날짜 생성
  const dates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));

  const handleDateSelect = (date) => {
    const formattedDate = format(date, 'yyyyMMdd');
    updateReservationData({ date: formattedDate });
    navigate('/time');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          날짜 선택
        </Typography>
        <Box sx={{ mt: 4, display: 'grid', gap: 2, gridTemplateColumns: 'repeat(2, 1fr)' }}>
          {dates.map((date) => (
            <Button
              key={date.toISOString()}
              variant="outlined"
              onClick={() => handleDateSelect(date)}
              sx={{ height: '60px' }}
            >
              {format(date, 'M월 d일 (EEE)', { locale: ko })}
            </Button>
          ))}
        </Box>
      </Box>
    </Container>
  );
}

export default DateSelection; 
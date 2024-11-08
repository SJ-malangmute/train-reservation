import { HashRouter, Routes, Route } from 'react-router-dom';
import { ReservationProvider } from './context/ReservationContext';
import TrainSelection from './components/TrainSelection';
import StationSelection from './components/StationSelection';
import DateSelection from './components/DateSelection';
import TimeSelection from './components/TimeSelection';
import PassengerCount from './components/PassengerCount';
import TrainList from './components/TrainList';
import ReservationStatus from './components/ReservationStatus';

function App() {
  return (
    <ReservationProvider>
      <HashRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<TrainSelection />} />
            <Route path="/station" element={<StationSelection />} />
            <Route path="/date" element={<DateSelection />} />
            <Route path="/time" element={<TimeSelection />} />
            <Route path="/passengers" element={<PassengerCount />} />
            <Route path="/trains" element={<TrainList />} />
            <Route path="/status" element={<ReservationStatus />} />
          </Routes>
        </div>
      </HashRouter>
    </ReservationProvider>
  );
}

export default App; 
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { MainMapScreen } from './screens/MainMapScreen';
import { StopDetailScreen } from './screens/StopDetailScreen';
import { BusListScreen } from './screens/BusListScreen';
import { RouteDetailScreen } from './screens/RouteDetailScreen';
import { AlertsScreen } from './screens/AlertsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { AppLayout } from './components/AppLayout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<MainMapScreen />} />
          <Route path="stop/:id" element={<StopDetailScreen />} />
          <Route path="buses" element={<BusListScreen />} />
          <Route path="route" element={<RouteDetailScreen />} />
          <Route path="alerts" element={<AlertsScreen />} />
          <Route path="profile" element={<ProfileScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
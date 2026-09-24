import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { LoginScreen } from './screens/LoginScreen';
import { MainMapScreen } from './screens/MainMapScreen';
import { StopDetailScreen } from './screens/StopDetailScreen';
import { BusListScreen } from './screens/BusListScreen';
import { RouteDetailScreen } from './screens/RouteDetailScreen';
import { AlertsScreen } from './screens/AlertsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { ManagementScreen } from './screens/ManagementScreen';
import { AppLayout } from './components/AppLayout';
import { AuthProvider } from './auth/AuthContext';
import { ProtectedRoute } from './auth/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<MainMapScreen />} />
              <Route path="stop/:id" element={<StopDetailScreen />} />
              <Route path="buses" element={<BusListScreen />} />
              <Route path="route" element={<RouteDetailScreen />} />
              <Route path="alerts" element={<AlertsScreen />} />
              <Route path="profile" element={<ProfileScreen />} />
              <Route path="management" element={<ManagementScreen />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

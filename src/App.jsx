import { PrivateRoute, GuestRoute } from './components/RouteGuards';
import AuthPage from './pages/AuthPage';
import MyGaragePage from './pages/MyGaragePage';
import { Route, Routes } from 'react-router-dom';
import CarDetailsPage from './pages/CarDetailsPage';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="cars" element={<ExplorePage />} />
        <Route path="cars/:carId" element={<CarDetailsPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route element={<GuestRoute />}>
          <Route path="login" element={<AuthPage key="login" />} />
          <Route path="register" element={<AuthPage key="register" registering />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="my-garage" element={<MyGaragePage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { Modal, OrderInfo, IngredientDetails } from '@components';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader } from '@components';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchIngredients } from '../../slices/ingredientsSlice';
import { AppDispatch } from 'src/store';

const AppContent = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  const state = location.state as { backgroundLocation?: Location } | null;
  const background = state?.backgroundLocation;
  return (
    <>
      {/* 1. ОСНОВНЫЕ МАРШРУТЫ: Если есть фоновая страница, фиксируем её. Если нет — берем текущую */}
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/profile/orders' element={<ProfileOrders />} />
        {/* Страницы для открытия ингредиентов и заказов в отдельной вкладке */}
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/profile/orders/:number' element={<OrderInfo />} />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* 2. МОДАЛЬНЫЕ ОКНА: Рендерятся только тогда, когда мы кликнули по карточке И у нас есть сохраненный фон */}
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal
                title='Детали заказа'
                onClose={() => window.history.back()}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title='Детали ингредиента'
                onClose={() => window.history.back()}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal
                title='Детали заказа'
                onClose={() => window.history.back()}
              >
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </>
  );
};
const App = () => (
  <BrowserRouter>
    <div className={styles.app}>
      <AppHeader />
      <AppContent />
    </div>
  </BrowserRouter>
);

export default App;

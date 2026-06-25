import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps) => {
  const location = useLocation();

  const isAuthChecked = true;
  const user = null;

  // 1. Если проверка авторизации еще идет, показываем спиннер
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // 2. Если роут только для гостей (например, /login), а юзер уже авторизован
  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} />;
  }

  // 3. Если роут защищенный (например, /profile), а юзер НЕ авторизован
  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  // 4. Если всё в порядке, рендерим защищенную страницу
  return children;
};

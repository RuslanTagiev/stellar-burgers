import { FC } from 'react';
import { useSelector } from 'react-redux';
import { getUserData } from '../../slices/userSlice';
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  const user = useSelector(getUserData);
  return <AppHeaderUI userName={user?.name || ''} />;
};

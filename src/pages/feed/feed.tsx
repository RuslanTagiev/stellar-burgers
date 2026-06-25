import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchFeeds,
  getFeedsLoading,
  getFeedsOrders
} from '../../slices/feedSlices';
import { AppDispatch } from '../../store';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const orders = useSelector(getFeedsOrders);
  const loading = useSelector(getFeedsLoading);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (loading) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
  );
};

import { FC, useMemo } from 'react';
import { OrdersListUI } from '../ui/orders-list';
import { OrdersListProps } from './type';

export const OrdersList: FC<OrdersListProps> = ({ orders }) => {
  const orderByDate = useMemo(
    () =>
      [...orders].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [orders]
  );

  return <OrdersListUI orderByDate={orderByDate} />;
};

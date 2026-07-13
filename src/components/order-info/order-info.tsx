import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { getIngredientsItems } from '../../slices/ingredientsSlice';
import {
  getFeedsOrders,
  fetchOrderByNumber,
  getOrderByNumberData
} from '../../slices/feedSlices';
import {
  getProfileOrders,
  fetchProfileOrders,
  resetOrder
} from '../../slices/orderSlice';

type TIngredientsWithCount = {
  [key: string]: TIngredient & { count: number };
};

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const ingredients = useSelector(getIngredientsItems);
  const feedOrders = useSelector(getFeedsOrders);
  const profileOrders = useSelector(getProfileOrders);
  const serverOrder = useSelector(getOrderByNumberData);

  const orderData = useMemo(() => {
    if (!number) return undefined;

    const orderNumber = Number(number);

    let order = feedOrders.find((item) => item.number === orderNumber);
    if (order) return order;

    order = profileOrders.find((item) => item.number === orderNumber);
    if (order) return order;

    if (serverOrder && serverOrder.number === orderNumber) {
      return serverOrder;
    }

    return undefined;
  }, [number, feedOrders, profileOrders, serverOrder]);

  useEffect(() => {
    if (!orderData && number) {
      dispatch(fetchOrderByNumber(Number(number)));
    }

    if (profileOrders.length === 0) {
      dispatch(fetchProfileOrders());
    }

    return () => {
      dispatch(resetOrder());
    };
  }, [dispatch, orderData, number, profileOrders.length]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item: string) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};

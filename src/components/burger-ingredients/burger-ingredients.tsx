import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSelector } from 'react-redux';
import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import {
  getIngredientsItems,
  getIngredientsLoading
} from '../../slices/ingredientsSlice';
import { Preloader } from '@ui';

export const BurgerIngredients: FC = () => {
  const allIngredients = useSelector(getIngredientsItems);
  const loading = useSelector(getIngredientsLoading);

  const buns = allIngredients.filter((ing) => ing.type === 'bun');
  const mains = allIngredients.filter((ing) => ing.type === 'main');
  const sauces = allIngredients.filter((ing) => ing.type === 'sauce');

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const isClickScrolling = useRef(false);

  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsInViewRef, inViewBuns] = useInView({ threshold: 0.1 });
  const [mainsInViewRef, inViewFilling] = useInView({ threshold: 0.1 });
  const [saucesInViewRef, inViewSauces] = useInView({ threshold: 0.1 });

  const setBunsRef = (node: HTMLHeadingElement | null) => {
    (titleBunRef as any).current = node;
    bunsInViewRef(node);
  };

  const setMainsRef = (node: HTMLHeadingElement | null) => {
    (titleMainRef as any).current = node;
    mainsInViewRef(node);
  };

  const setSaucesRef = (node: HTMLHeadingElement | null) => {
    (titleSaucesRef as any).current = node;
    saucesInViewRef(node);
  };

  useEffect(() => {
    if (isClickScrolling.current) return;

    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    isClickScrolling.current = true;

    let targetRef;
    if (tab === 'bun') targetRef = titleBunRef;
    if (tab === 'main') targetRef = titleMainRef;
    if (tab === 'sauce') targetRef = titleSaucesRef;

    if (targetRef?.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    setTimeout(() => {
      isClickScrolling.current = false;
    }, 1000);
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={setBunsRef as any}
      titleMainRef={setMainsRef as any}
      titleSaucesRef={setSaucesRef as any}
      bunsRef={bunsInViewRef}
      mainsRef={mainsInViewRef}
      saucesRef={saucesInViewRef}
      onTabClick={onTabClick}
    />
  );
};

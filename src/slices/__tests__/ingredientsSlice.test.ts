import ingredientsReducer, { fetchIngredients } from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('Тестирование редьюсера ingredients', () => {
  const initialState = {
    items: [],
    loading: false,
    error: null
  };

  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Краторная булка',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1250,
      image: 'image-bun.png',
      image_mobile: 'image-bun-mobile.png',
      image_large: 'image-bun-large.png'
    },
    {
      _id: '2',
      name: 'Биокотлета',
      type: 'main',
      proteins: 40,
      fat: 10,
      carbohydrates: 20,
      calories: 100,
      price: 400,
      image: 'image-main.png',
      image_mobile: 'image-main-mobile.png',
      image_large: 'image-main-large.png'
    }
  ];

  // 1. Тест на неизвестный экшен и undefined состояние
  test('должен возвращать начальное состояние при неизвестном экшене', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialState
    );
  });

  // 2. Тест асинхронного экшена: pending
  test('должен обрабатывать fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  // 3. Тест асинхронного экшена: fulfilled
  test('должен обрабатывать fetchIngredients.fulfilled', () => {
    // Входящее состояние может быть с loading: true, проверяем переход в false и запись данных
    const preloadedState = { ...initialState, loading: true };
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = ingredientsReducer(preloadedState, action);

    expect(state.loading).toBe(false);
    expect(state.items).toEqual(mockIngredients);
  });

  // 4. Тест асинхронного экшена: rejected
  test('должен обрабатывать fetchIngredients.rejected', () => {
    const preloadedState = { ...initialState, loading: true };
    const errorMessage = 'Сеть недоступна';

    // Передаем ошибку в структуру, которую генерирует Redux Toolkit для rejected экшенов
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: errorMessage }
    };
    const state = ingredientsReducer(preloadedState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  // 5. Тест асинхронного экшена: rejected (с дефолтным текстом ошибки)
  test('должен устанавливать дефолтный текст ошибки при fetchIngredients.rejected без сообщения', () => {
    const action = { type: fetchIngredients.rejected.type, error: {} };
    const state = ingredientsReducer(initialState, action);

    expect(state.error).toBe('Не удалось загрузить ингредиенты');
  });
});

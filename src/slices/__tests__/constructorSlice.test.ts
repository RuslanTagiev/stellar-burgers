import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../constructorSlice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

describe('Тестирование редьюсера burgerConstructor', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  const mockBun: TIngredient = {
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
  };

  const mockIngredient: TIngredient = {
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
  };

  // 1. Тест на неизвестный экшен
  test('должен возвращать начальное состояние при неизвестном экшене', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialState
    );
  });

  // 2. Тест добавления булки
  test('должен добавлять булку через addIngredient', () => {
    const constructorBun: TConstructorIngredient = {
      ...mockBun,
      id: 'unique-bun-id'
    };
    const action = { type: addIngredient.type, payload: constructorBun };

    const state = constructorReducer(initialState, action);
    expect(state.bun).toEqual(constructorBun);
    expect(state.ingredients).toHaveLength(0);
  });

  // 3. Тест добавления ингредиента
  test('должен добавлять начинку в массив ingredients через addIngredient', () => {
    const constructorIngredient: TConstructorIngredient = {
      ...mockIngredient,
      id: 'unique-id-1'
    };
    const action = { type: addIngredient.type, payload: constructorIngredient };

    const state = constructorReducer(initialState, action);
    expect(state.bun).toBeNull();
    expect(state.ingredients).toContainEqual(constructorIngredient);
  });

  // 4. Тест удаления ингредиента
  test('должен удалять ингредиент по id через removeIngredient', () => {
    const item1 = { ...mockIngredient, id: 'id-1' };
    const item2 = { ...mockIngredient, id: 'id-2' };
    const preloadedState = {
      bun: null,
      ingredients: [item1, item2]
    };

    const state = constructorReducer(preloadedState, removeIngredient('id-1'));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].id).toBe('id-2');
  });

  // 5. Тест изменения порядка ингредиентов
  test('должен менять порядок ингредиентов через moveIngredient', () => {
    const item1 = { ...mockIngredient, id: 'id-1', name: 'Первый' };
    const item2 = { ...mockIngredient, id: 'id-2', name: 'Второй' };
    const preloadedState = {
      bun: null,
      ingredients: [item1, item2]
    };

    // Перемещаем элемент с индекса 0 на индекс 1
    const state = constructorReducer(
      preloadedState,
      moveIngredient({ from: 0, to: 1 })
    );
    expect(state.ingredients[0].id).toBe('id-2');
    expect(state.ingredients[1].id).toBe('id-1');
  });

  // 6. Тест очистки конструктора
  test('должен очищать конструктор через clearConstructor', () => {
    const preloadedState = {
      bun: { ...mockBun, id: 'bun-id' },
      ingredients: [{ ...mockIngredient, id: 'id-1' }]
    };

    const state = constructorReducer(preloadedState, clearConstructor());
    expect(state).toEqual(initialState);
  });
});

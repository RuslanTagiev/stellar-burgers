import { test, expect } from '@playwright/test';

const MOCK_USER = {
  success: true,
  user: {
    email: 'testuser@yandex.ru',
    name: 'Руслан'
  }
};

const MOCK_ORDER = {
  success: true,
  order: {
    number: 48573
  }
};

test.describe('Тестирование функциональности конструктора бургеров', () => {
  test.beforeEach(async ({ page, context }) => {
    await page.routeFromHAR('tests/hars/api.har', {
      updateContent: 'embed',
      notFound: 'fallback'
    });

    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({ json: MOCK_USER });
    });

    await page.route('**/api/orders', async (route) => {
      await route.fulfill({ json: MOCK_ORDER });
    });

    await page.addInitScript(() => {
      window.localStorage.setItem('refreshToken', 'mocked-refresh-token');
    });

    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer%20mocked-access-token',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.goto('/');
  });

  test('Добавление ingredients в конструктор бургера', async ({ page }) => {
    await page
      .locator('div, a, li')
      .filter({ hasText: 'Краторная булка N-200i' })
      .locator('button')
      .first()
      .click();
    await page
      .locator('div, a, li')
      .filter({ hasText: 'Биокотлета из марсианской' })
      .locator('button')
      .first()
      .click();

    const constructorSection = page.locator('body');
    await expect(constructorSection).toContainText('Краторная булка N-200i');
    await expect(constructorSection).toContainText('Биокотлета из марсианской');
  });

  test('Работа модальных окон описания ingredients', async ({ page }) => {
    await page.getByText('Краторная булка N-200i').click();

    const modal = page.locator('#modals');
    await expect(modal).toContainText('Детали ингредиента');

    await modal.locator('button').first().click();
    await expect(modal).toBeEmpty();

    await page.getByText('Краторная булка N-200i').click();
    await expect(modal).toContainText('Детали ингредиента');

    await page.mouse.click(10, 10);
    await expect(modal).toBeEmpty();
  });

  test('Полный цикл создания заказа с авторизацией', async ({ page }) => {
    await page
      .locator('div, a, li')
      .filter({ hasText: 'Краторная булка N-200i' })
      .locator('button')
      .first()
      .click();
    await page
      .locator('div, a, li')
      .filter({ hasText: 'Биокотлета из марсианской' })
      .locator('button')
      .first()
      .click();

    await page.getByRole('button', { name: /оформить заказ/i }).click();

    const modal = page.locator('#modals');
    await expect(modal).toContainText('48573');

    await modal.locator('button').first().click();
    await expect(modal).toBeEmpty();

    await expect(page.locator('body')).toContainText('Выберите булки');
  });
});

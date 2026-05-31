// @ts-check
import { test, expect } from '@playwright/test';

/**
 * ============================================================
 * TEST SUITE: Đăng nhập tài khoản - Gymstore.vn
 * ============================================================
 * Test đăng nhập với tài khoản tenlachay@gmail.com
 */

test.describe('Gymstore.vn - Đăng nhập tài khoản', () => {

  test('TC-LOGIN-01: Đăng nhập với email và mật khẩu hợp lệ', async ({ page }) => {
    // Truy cập trang đăng nhập
    await page.goto('/account/login');
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/account\/login/);

    // Điền email
    const emailField = page.locator('input[name="email"], input[name="username"], input[type="email"], input[type="text"][name*="email"]');
    await emailField.first().fill('tenlachay@gmail.com');

    // Điền mật khẩu
    const passwordField = page.locator('input[name="password"], input[type="password"]');
    await passwordField.first().fill('akongachay123');

    // Click nút đăng nhập
    const loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Đăng nhập")');
    await loginButton.first().click();

    // Đợi trang xử lý đăng nhập và chuyển hướng khỏi trang đăng nhập
    await page.waitForURL((url) => !url.pathname.includes('/account/login'), { timeout: 10000 });

    // Kiểm tra đăng nhập thành công
    const currentUrl = page.url();
    const isLoggedIn = !currentUrl.includes('/account/login');
    expect(isLoggedIn).toBeTruthy();
  });
});

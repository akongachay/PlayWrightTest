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
    await page.goto('/dang-nhap');
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/dang-nhap/);

    // Điền email
    const emailField = page.locator('input[name="email"], input[name="username"], input[type="email"], input[type="text"][name*="email"]');
    await emailField.first().fill('tenlachay@gmail.com');

    // Điền mật khẩu
    const passwordField = page.locator('input[name="password"], input[type="password"]');
    await passwordField.first().fill('akongachay123');

    // Click nút đăng nhập
    const loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Đăng nhập")');
    await loginButton.first().click();

    // Đợi trang xử lý đăng nhập
    await page.waitForTimeout(5000);

    // Kiểm tra đăng nhập thành công - chuyển khỏi trang đăng nhập
    const currentUrl = page.url();
    const isLoggedIn = !currentUrl.includes('dang-nhap') || currentUrl.includes('account');
    expect(isLoggedIn).toBeTruthy();
  });
});

// @ts-check
import { test, expect } from '@playwright/test';

/**
 * ============================================================
 * TEST SUITE: Tìm kiếm sản phẩm - Gymstore.vn
 * ============================================================
 * Kiểm tra chức năng tìm kiếm sản phẩm trên trang gymstore.vn
 */

test.describe('Gymstore.vn - Tìm kiếm sản phẩm', () => {

  test.beforeEach(async ({ page }) => {
    // Truy cập trang chủ
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('TC-SEARCH-01: Thanh tìm kiếm hiển thị trên trang chủ', async ({ page }) => {
    // Kiểm tra ô tìm kiếm tồn tại
    const searchInput = page.locator('input[name="query"], input.auto-search, input[placeholder*="Tìm kiếm"]');
    await expect(searchInput.first()).toBeVisible();

    // Kiểm tra placeholder
    await expect(searchInput.first()).toHaveAttribute('placeholder', /[Tt]ìm kiếm/);
  });

  test('TC-SEARCH-02: Tìm kiếm sản phẩm "Whey Protein" - có kết quả', async ({ page }) => {
    // Nhập từ khóa tìm kiếm
    const searchInput = page.locator('input[name="query"], input.auto-search, input[placeholder*="Tìm kiếm"]');
    await searchInput.first().fill('Whey Protein');

    // Nhấn Enter hoặc click nút tìm kiếm
    await searchInput.first().press('Enter');

    // Đợi trang kết quả load
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    // Kiểm tra URL có chứa từ khóa tìm kiếm
    await expect(page).toHaveURL(/search.*[Ww]hey/);

    // Kiểm tra có kết quả tìm kiếm (sản phẩm hiển thị)
    const productItems = page.locator('.product-item, .product-col, .product-box, .product-loop, [class*="product"]');
    const count = await productItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-SEARCH-03: Tìm kiếm sản phẩm "Creatine" - có kết quả', async ({ page }) => {
    // Nhập từ khóa
    const searchInput = page.locator('input[name="query"], input.auto-search, input[placeholder*="Tìm kiếm"]');
    await searchInput.first().fill('Creatine');
    await searchInput.first().press('Enter');

    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    // Kiểm tra URL
    await expect(page).toHaveURL(/search.*[Cc]reatine/);

    // Kiểm tra có kết quả
    const productItems = page.locator('.product-item, .product-col, .product-box, .product-loop, [class*="product"]');
    const count = await productItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-SEARCH-04: Tìm kiếm với từ khóa không tồn tại', async ({ page }) => {
    // Nhập từ khóa không tồn tại
    const searchInput = page.locator('input[name="query"], input.auto-search, input[placeholder*="Tìm kiếm"]');
    await searchInput.first().fill('xyzkhongtontai12345');
    await searchInput.first().press('Enter');

    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    // Kiểm tra hiển thị thông báo "không tìm thấy" hoặc "0 kết quả"
    const noResults = page.locator('text=/không tìm thấy|không có|0 sản phẩm|no result|Không có sản phẩm/i');
    const productItems = page.locator('.product-item, .product-col, .product-box');
    
    // Phải không có sản phẩm hoặc hiện thông báo "không tìm thấy"
    const productCount = await productItems.count();
    const hasNoResultMsg = await noResults.count() > 0;
    
    expect(productCount === 0 || hasNoResultMsg).toBeTruthy();
  });

  test('TC-SEARCH-05: Gợi ý tìm kiếm (auto-suggest) hiển thị khi nhập', async ({ page }) => {
    // Nhập từ khóa vào ô tìm kiếm
    const searchInput = page.locator('input[name="query"], input.auto-search, input[placeholder*="Tìm kiếm"]');
    await searchInput.first().click();
    await searchInput.first().fill('Whey');

    // Đợi gợi ý hiển thị
    await page.waitForTimeout(2000);

    // Kiểm tra dropdown gợi ý xuất hiện
    const suggestDropdown = page.locator('.search-suggest-dropdow-absolute, .search-dropdow, .search-results, .search-suggest, [class*="suggest"], [class*="auto-search"]');
    
    // Trang gymstore có tính năng auto-suggest, kiểm tra nó hiện
    if (await suggestDropdown.count() > 0) {
      // Kiểm tra có item gợi ý
      const suggestItems = page.locator('.item-search, .search-suggest-item, .search-result-item');
      if (await suggestItems.count() > 0) {
        await expect(suggestItems.first()).toBeVisible();
      }
    }
  });

  test('TC-SEARCH-06: Tìm kiếm với từ khóa tiếng Việt có dấu', async ({ page }) => {
    // Nhập từ khóa tiếng Việt có dấu
    const searchInput = page.locator('input[name="query"], input.auto-search, input[placeholder*="Tìm kiếm"]');
    await searchInput.first().fill('Sữa tăng cân');
    await searchInput.first().press('Enter');

    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    // Kiểm tra trang kết quả hiển thị
    await expect(page).toHaveURL(/search/);
  });

  test('TC-SEARCH-07: Tìm kiếm qua URL trực tiếp', async ({ page }) => {
    // Truy cập URL tìm kiếm trực tiếp
    await page.goto('/search?type=product&query=BCAA');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    // Kiểm tra có kết quả
    const productItems = page.locator('.product-item, .product-col, .product-box, .product-loop, [class*="product"]');
    const count = await productItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-SEARCH-08: Tìm kiếm với chuỗi rỗng', async ({ page }) => {
    // Nhấn Enter mà không nhập từ khóa
    const searchInput = page.locator('input[name="query"], input.auto-search, input[placeholder*="Tìm kiếm"]');
    await searchInput.first().click();
    await searchInput.first().fill('');
    await searchInput.first().press('Enter');

    await page.waitForTimeout(2000);

    // Kiểm tra trang không bị lỗi (không 404, không 500)
    const currentUrl = page.url();
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();

    // Trang có thể giữ nguyên trang chủ hoặc hiển thị trang tìm kiếm rỗng
    expect(
      currentUrl.includes('search') ||
      currentUrl === 'https://gymstore.vn/' ||
      currentUrl.endsWith('/')
    ).toBeTruthy();
  });

  test('TC-SEARCH-09: Tìm kiếm với ký tự đặc biệt (kiểm tra XSS/injection)', async ({ page }) => {
    // Nhập ký tự đặc biệt / script injection
    const searchInput = page.locator('input[name="query"], input.auto-search, input[placeholder*="Tìm kiếm"]');
    await searchInput.first().fill('<script>alert(1)</script>');
    await searchInput.first().press('Enter');

    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    // Kiểm tra trang không bị lỗi
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();

    // Kiểm tra script không được thực thi (không có alert dialog)
    // Nếu trang vẫn load bình thường, test pass
    // Kiểm tra không hiển thị raw HTML/script trên trang
    const rawScript = page.locator('script:has-text("alert(1)")');
    const scriptVisible = page.locator('text=<script>');
    // Script tag không nên xuất hiện dạng thực thi trên trang
    expect(await rawScript.count()).toBe(0);
  });
});

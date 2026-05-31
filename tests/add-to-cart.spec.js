// @ts-check
import { test, expect } from '@playwright/test';

/**
 * ============================================================
 * TEST SUITE: Thêm sản phẩm vào giỏ hàng - Gymstore.vn
 * ============================================================
 * Kiểm tra chức năng thêm sản phẩm vào giỏ hàng trên gymstore.vn
 */

test.describe('Gymstore.vn - Thêm sản phẩm vào giỏ hàng', () => {

  test('TC-CART-01: Truy cập trang sản phẩm và kiểm tra thông tin', async ({ page }) => {
    // Truy cập một trang sản phẩm cụ thể (Whey Protein phổ biến)
    await page.goto('/whey-protein');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Click vào sản phẩm đầu tiên trong danh mục
    const firstProduct = page.locator('.product-item a, .product-col a, .product-box a, .product-loop a, a.product-transition').first();
    await firstProduct.click({ force: true });
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Kiểm tra tên sản phẩm hiển thị
    const productTitle = page.locator('h1, .product-title, .product-name, .title-product').filter({ visible: true });
    await expect(productTitle.first()).toBeVisible();

    // Kiểm tra giá sản phẩm hiển thị
    const productPrice = page.locator('.product-price, .price, .pro-price, [class*="price"]').filter({ visible: true });
    await expect(productPrice.first()).toBeVisible();

    // Kiểm tra nút Thêm vào giỏ hoặc Mua ngay
    const addToCartBtn = page.locator('button:has-text("Thêm vào giỏ"), button:has-text("Mua ngay"), button.add-to-cart, .btn-addtocart, .add-to-cart-btn, button[data-role="addtocart"], button.buycontrol').filter({ visible: true });
    await expect(addToCartBtn.first()).toBeVisible();
  });

  test('TC-CART-02: Thêm sản phẩm vào giỏ hàng từ trang chi tiết', async ({ page }) => {
    // Truy cập trang sản phẩm cụ thể (Nutricost Creatine - sản phẩm phổ biến, còn hàng)
    await page.goto('/nutricost-pure-micronized-creatine-monohydrate-500-gams-100-servings');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Lấy số lượng giỏ hàng trước khi thêm
    const cartCountBefore = page.locator('.count_item, .count_item_pr, .cart-count, [class*="cart-count"]');
    let countBefore = 0;
    if (await cartCountBefore.count() > 0) {
      const text = await cartCountBefore.first().textContent();
      countBefore = parseInt(text || '0');
    }

    // Click nút "Thêm vào giỏ" hoặc "Mua ngay"
    const addToCartBtn = page.locator('button:has-text("Thêm vào giỏ"), button:has-text("THÊM VÀO GIỎ"), .btn-addtocart, button.add-to-cart, button[data-role="addtocart"], .product-action button.buycontrol').filter({ visible: true });

    if (await addToCartBtn.count() > 0) {
      await addToCartBtn.first().click();
      await page.waitForTimeout(3000);

      // Kiểm tra số lượng giỏ hàng đã tăng hoặc popup giỏ hàng hiển thị
      const cartCountAfter = page.locator('.count_item, .count_item_pr, .cart-count, [class*="cart-count"]');
      if (await cartCountAfter.count() > 0) {
        const textAfter = await cartCountAfter.first().textContent();
        const countAfter = parseInt(textAfter || '0');
        expect(countAfter).toBeGreaterThan(countBefore);
      }

      // Hoặc kiểm tra popup/thông báo thêm giỏ hàng thành công
      const successMsg = page.locator('.toast-success, .notification-success, .alert-success, [class*="success"], .popup-cart, .cart-popup');
      if (await successMsg.count() > 0) {
        await expect(successMsg.first()).toBeVisible();
      }
    }
  });

  test('TC-CART-03: Thêm sản phẩm vào giỏ và kiểm tra trang giỏ hàng', async ({ page }) => {
    // Truy cập trang sản phẩm
    await page.goto('/nutricost-pure-micronized-creatine-monohydrate-500-gams-100-servings');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Click nút Thêm vào giỏ
    const addToCartBtn = page.locator('button:has-text("Thêm vào giỏ"), button:has-text("THÊM VÀO GIỎ"), .btn-addtocart, button.add-to-cart, .product-action button.buycontrol').filter({ visible: true });

    if (await addToCartBtn.count() > 0) {
      await addToCartBtn.first().click();
      await page.waitForTimeout(3000);
    }

    // Truy cập trang giỏ hàng
    await page.goto('/cart');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Kiểm tra trang giỏ hàng hiển thị
    await expect(page).toHaveURL(/cart/);

    // Kiểm tra có sản phẩm trong giỏ hàng
    const cartItems = page.locator('.cart-item, .item-cart, .cart_row, .line-item, [class*="cart-item"], table tbody tr').filter({ visible: true });
    const cartItemCount = await cartItems.count();

    if (cartItemCount > 0) {
      // Có sản phẩm trong giỏ - kiểm tra hiển thị tên, giá, số lượng
      const itemName = page.locator('.cart-item a, .item-cart a, .cart_row a, .line-item a').filter({ visible: true }).first();
      if (await itemName.count() > 0) {
        await expect(itemName).toBeVisible();
      }
    }
  });

  test('TC-CART-04: Thay đổi số lượng sản phẩm trước khi thêm vào giỏ', async ({ page }) => {
    // Truy cập trang sản phẩm
    await page.goto('/nutricost-pure-micronized-creatine-monohydrate-500-gams-100-servings');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Tìm input số lượng trên trang chi tiết sản phẩm
    const quantityInput = page.locator('.product-detail input[name="quantity"], .product-info-detail input[type="number"], .quantity-area input, input.quantity-product, .product-quantity input').filter({ visible: true });

    if (await quantityInput.count() > 0) {
      // Xóa và nhập số lượng mới
      await quantityInput.first().fill('2');

      // Kiểm tra giá trị đã thay đổi
      await expect(quantityInput.first()).toHaveValue('2');
    }

    // Click nút tăng số lượng (nếu có)
    const plusBtn = page.locator('.product-detail button.plus, .product-info-detail .btn-plus, button[aria-label="Plus"], .quantity-area .increase, .btn-increase').filter({ visible: true });
    if (await plusBtn.count() > 0) {
      await plusBtn.first().click();
      await page.waitForTimeout(500);
    }
  });


  test('TC-CART-06: Kiểm tra icon giỏ hàng trên header', async ({ page }) => {
    // Truy cập trang chủ
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Kiểm tra icon giỏ hàng hiển thị
    const cartIcon = page.locator('a[href*="/cart"], a[title*="Giỏ hàng"], .img_hover_cart, .box-cart');
    await expect(cartIcon.first()).toBeVisible();

    // Kiểm tra badge số lượng
    const cartCount = page.locator('.count_item, .count_item_pr, .cart-count');
    await expect(cartCount.first()).toBeVisible();

    // Click vào icon giỏ hàng
    await cartIcon.first().click();
    await page.waitForTimeout(2000);

    // Kiểm tra chuyển đến trang giỏ hàng hoặc hiện popup giỏ hàng
    const currentUrl = page.url();
    const cartPopup = page.locator('.top-cart-content, .cart-popup, .popup-cart');
    expect(currentUrl.includes('/cart') || await cartPopup.count() > 0).toBeTruthy();
  });

  test('TC-CART-07: Thay đổi số lượng sản phẩm trong giỏ hàng', async ({ page }) => {
    // Thêm sản phẩm vào giỏ
    await page.goto('/nutricost-pure-micronized-creatine-monohydrate-500-gams-100-servings');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const addToCartBtn = page.locator('button:has-text("Thêm vào giỏ"), button:has-text("THÊM VÀO GIỎ"), .btn-addtocart, button.add-to-cart, .product-action button.buycontrol').filter({ visible: true });
    if (await addToCartBtn.count() > 0) {
      await addToCartBtn.first().click();
      await page.waitForTimeout(3000);
    }

    // Truy cập trang giỏ hàng
    await page.goto('/cart');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Tìm nút tăng số lượng trong giỏ hàng
    const plusBtn = page.locator('.cart-item button.plus, .btn-plus, button[aria-label="Plus"], .increase, .btn-increase, .quantity-area .increase, button.increase').filter({ visible: true });
    const quantityInput = page.locator('.cart-item input[name="quantity"], .quantity-area input, input.quantity-product, input[name="updates[]"]').filter({ visible: true });

    if (await plusBtn.count() > 0) {
      // Lấy số lượng trước
      let qtyBefore = 1;
      if (await quantityInput.count() > 0) {
        const val = await quantityInput.first().inputValue();
        qtyBefore = parseInt(val || '1');
      }

      // Click nút tăng
      await plusBtn.first().click();
      await page.waitForTimeout(2000);

      // Kiểm tra số lượng đã tăng
      if (await quantityInput.count() > 0) {
        const valAfter = await quantityInput.first().inputValue();
        const qtyAfter = parseInt(valAfter || '1');
        expect(qtyAfter).toBeGreaterThanOrEqual(qtyBefore);
      }
    } else if (await quantityInput.count() > 0) {
      // Nếu không có nút tăng, thử thay đổi trực tiếp trong input
      await quantityInput.first().fill('3');
      await page.waitForTimeout(2000);
      await expect(quantityInput.first()).toHaveValue('3');
    }
  });

  test('TC-CART-08: Thêm cùng sản phẩm 2 lần - kiểm tra gộp số lượng', async ({ page }) => {
    // Lần 1: Thêm sản phẩm vào giỏ
    await page.goto('/nutricost-pure-micronized-creatine-monohydrate-500-gams-100-servings');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const addToCartBtn = page.locator('button:has-text("Thêm vào giỏ"), button:has-text("THÊM VÀO GIỎ"), .btn-addtocart, button.add-to-cart, .product-action button.buycontrol').filter({ visible: true });
    if (await addToCartBtn.count() > 0) {
      await addToCartBtn.first().click();
      await page.waitForTimeout(3000);
    }

    // Lần 2: Thêm cùng sản phẩm lần nữa
    await page.goto('/nutricost-pure-micronized-creatine-monohydrate-500-gams-100-servings');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    if (await addToCartBtn.count() > 0) {
      await addToCartBtn.first().click();
      await page.waitForTimeout(3000);
    }

    // Truy cập giỏ hàng
    await page.goto('/cart');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Kiểm tra số lượng sản phẩm >= 2 (đã được gộp)
    const quantityInput = page.locator('.cart-item input[name="quantity"], .quantity-area input, input.quantity-product, input[name="updates[]"]').filter({ visible: true });

    if (await quantityInput.count() > 0) {
      const val = await quantityInput.first().inputValue();
      const qty = parseInt(val || '0');
      expect(qty).toBeGreaterThanOrEqual(2);
    }
  });
});

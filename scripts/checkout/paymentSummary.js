import {cart} from '../../data/cart.js';
import {products, getProduct} from '../../data/products.js';
import {deliveryOptions, getDeliveryOption} from '../../data/deliverypotions.js'
import {formatCurrency} from '../utils/money.js';
import { updateCartQuantityCheckout } from './orderSummary.js';

function calculateItems() {
    const totalItems = updateCartQuantityCheckout();
    let totalHTML = '';
    if (totalItems > 1){
        totalHTML += `Items (${totalItems})`;
    } else {
        totalHTML += `Item (${totalItems})`;
    }

    return totalHTML;
}

export function renderPaymentSummary(){
    let productPriceCents = 0
    let shippingPriceCents = 0

    cart.forEach((cartItem) => {
        const product = getProduct(cartItem.productId);
        productPriceCents += product.priceCents * cartItem.quantity

        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
        shippingPriceCents += deliveryOption.priceCents;

    });

    const totalItems = updateCartQuantityCheckout();

    const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
    const taxCents = (totalBeforeTaxCents * 10) / 100;
    const totalCents = totalBeforeTaxCents + taxCents;

    const paymentSummaryHTML = `
    <div class="payment-summary-title">
        Order Summary
    </div>

    <div class="payment-summary-row">
        <div>${calculateItems()}:</div>
        <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
    </div>

    <div class="payment-summary-row">
        <div>Shipping &amp; handling:</div>
        <div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
        <div>Total before tax:</div>
        <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
    </div>

    <div class="payment-summary-row">
        <div>Estimated tax (10%):</div>
        <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
    </div>

    <div class="payment-summary-row total-row">
        <div>Order total:</div>
        <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
    </div>

    <button class="place-order-button button-primary js-button-primary">
        Place your order
    </button>
    <div id="customAlert" class="custom-alert">
        <div class="custom-alert-content">
            <span class="custom-alert-message"></span>
            <button class="custom-alert-close">Close</button>
        </div>
    </div>
    `

    document.querySelector(".js-payment-summary").innerHTML = paymentSummaryHTML;
    const primaryButton = document.querySelector('.js-button-primary');

    // Select custom alert elements
    const customAlert = document.getElementById('customAlert');
    const customAlertMessage = document.querySelector('.custom-alert-message');
    const customAlertClose = document.querySelector('.custom-alert-close');

    // Add event listener to the button
    primaryButton.addEventListener('click', function() {
        // Display custom alert message
        customAlertMessage.textContent = 'Your order has been submitted!';
        customAlert.style.display = 'block';
        
        // Close the custom alert after 3 seconds
        setTimeout(function() {
            customAlert.style.display = 'none';
        }, 3000); // 3000 milliseconds = 3 seconds
    });

    // Add event listener to close button
    customAlertClose.addEventListener('click', function() {
        customAlert.style.display = 'none';
    });
}
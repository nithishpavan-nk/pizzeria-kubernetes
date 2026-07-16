import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/Cart.css';

function Cart() {
  const { items, subtotal, incrementItem, decrementItem, removeItem } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="cartPage cartEmpty">
        <h1>Your cart is empty</h1>
        <p>Looks like you haven't added any pizzas yet.</p>
        <Link to="/menu" className="primaryLink">
          <button>Browse the menu</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="cartPage">
      <h1>Your Cart</h1>

      <div className="cartList">
        {items.map((item) => (
          <div className="cartRow" key={item.menuItemId}>
            <div className="cartRowImage" style={{ backgroundImage: `url(${item.image})` }} />
            <div className="cartRowDetails">
              <h3>{item.name}</h3>
              <p className="cartRowPrice">${item.price.toFixed(2)} each</p>
            </div>
            <div className="cartRowQuantity">
              <button
                type="button"
                onClick={() => decrementItem(item.menuItemId)}
                aria-label={`Decrease quantity of ${item.name}`}
              >
                &minus;
              </button>
              <span>{item.quantity}</span>
              <button
                type="button"
                onClick={() => incrementItem(item.menuItemId)}
                aria-label={`Increase quantity of ${item.name}`}
              >
                +
              </button>
            </div>
            <p className="cartRowSubtotal">${(item.price * item.quantity).toFixed(2)}</p>
            <button
              type="button"
              className="cartRowRemove"
              onClick={() => removeItem(item.menuItemId)}
              aria-label={`Remove ${item.name} from cart`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cartSummary">
        <div className="cartSummaryRow">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <p className="cartSummaryNote">Delivery fee and taxes calculated at checkout.</p>
        <button type="button" className="checkoutButton" onClick={() => navigate('/checkout')}>
          Proceed to Checkout
        </button>
        <Link to="/menu" className="continueShoppingLink">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

export default Cart;

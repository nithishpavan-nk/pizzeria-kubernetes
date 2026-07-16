import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../api/client';
import '../styles/Checkout.css';

const initialForm = {
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  deliveryAddress: '',
  notes: '',
};

function validate(form) {
  const errors = {};

  if (!form.customerName.trim()) errors.customerName = 'Name is required.';

  if (!form.customerEmail.trim()) {
    errors.customerEmail = 'Email is required so we can send your confirmation.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail)) {
    errors.customerEmail = "That email doesn't look right.";
  }

  if (!form.deliveryAddress.trim()) {
    errors.deliveryAddress = 'Add a delivery address (or write "Pickup").';
  }

  return errors;
}

function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitState, setSubmitState] = useState('idle'); // idle | submitting | error
  const [submitError, setSubmitError] = useState(null);

  if (items.length === 0) {
    return <Navigate to="/menu" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate({ ...form }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    setTouched({ customerName: true, customerEmail: true, deliveryAddress: true });

    if (Object.keys(validationErrors).length > 0) return;

    setSubmitState('submitting');
    setSubmitError(null);

    try {
      const result = await createOrder({
        customerName: form.customerName.trim(),
        customerEmail: form.customerEmail.trim(),
        customerPhone: form.customerPhone.trim() || null,
        deliveryAddress: form.deliveryAddress.trim(),
        notes: form.notes.trim() || null,
        items: items.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
        })),
      });

      clearCart();
      navigate(`/order-confirmation/${result.order.id}`, {
        state: { order: result.order, email: result.email },
      });
    } catch (err) {
      setSubmitState('error');
      setSubmitError(
        err.payload?.errors
          ? Object.values(err.payload.errors).join(' ')
          : err.message || 'Something went wrong placing your order.'
      );
    }
  };

  return (
    <div className="checkoutPage">
      <div className="checkoutForm">
        <h1>Checkout</h1>
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="customerName">Full Name</label>
          <input
            id="customerName"
            name="customerName"
            type="text"
            placeholder="Enter full name..."
            value={form.customerName}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(touched.customerName && errors.customerName)}
          />
          {touched.customerName && errors.customerName && (
            <span className="fieldError">{errors.customerName}</span>
          )}

          <label htmlFor="customerEmail">Email</label>
          <input
            id="customerEmail"
            name="customerEmail"
            type="email"
            placeholder="Enter email..."
            value={form.customerEmail}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(touched.customerEmail && errors.customerEmail)}
          />
          {touched.customerEmail && errors.customerEmail && (
            <span className="fieldError">{errors.customerEmail}</span>
          )}

          <label htmlFor="customerPhone">Phone (optional)</label>
          <input
            id="customerPhone"
            name="customerPhone"
            type="tel"
            placeholder="Enter phone number..."
            value={form.customerPhone}
            onChange={handleChange}
          />

          <label htmlFor="deliveryAddress">Delivery Address</label>
          <textarea
            id="deliveryAddress"
            name="deliveryAddress"
            rows="3"
            placeholder="Enter delivery address, or write 'Pickup'..."
            value={form.deliveryAddress}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(touched.deliveryAddress && errors.deliveryAddress)}
          />
          {touched.deliveryAddress && errors.deliveryAddress && (
            <span className="fieldError">{errors.deliveryAddress}</span>
          )}

          <label htmlFor="notes">Order Notes (optional)</label>
          <textarea
            id="notes"
            name="notes"
            rows="2"
            placeholder="Extra napkins, allergies, gate code, etc..."
            value={form.notes}
            onChange={handleChange}
          />

          {submitState === 'error' && (
            <p className="submitError" role="alert">{submitError}</p>
          )}

          <button type="submit" disabled={submitState === 'submitting'}>
            {submitState === 'submitting' ? 'Placing order...' : `Place Order — $${subtotal.toFixed(2)}`}
          </button>
        </form>
      </div>

      <div className="checkoutSummary">
        <h2>Order Summary</h2>
        <div className="checkoutSummaryList">
          {items.map((item) => (
            <div className="checkoutSummaryRow" key={item.menuItemId}>
              <span>{item.quantity}&times; {item.name}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="checkoutSummaryTotal">
          <span>Total</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <Link to="/cart" className="editCartLink">Edit cart</Link>
      </div>
    </div>
  );
}

export default Checkout;

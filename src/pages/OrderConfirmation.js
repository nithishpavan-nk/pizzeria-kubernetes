import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import '../styles/OrderConfirmation.css';

function OrderConfirmation() {
  const { orderId } = useParams();
  const location = useLocation();
  const order = location.state?.order;
  const email = location.state?.email;

  // If someone lands here directly (refresh, shared link) without router state,
  // we don't have the order details in memory — point them to track it via the API instead.
  if (!order) {
    return (
      <div className="confirmationPage">
        <div className="ticket">
          <div className="ticketStub">
            <span className="ticketLabel">Order Slip</span>
            <h2>Order #{orderId}</h2>
          </div>
          <p>
            We don't have the order details handy on this screen anymore (likely from a refresh).
            Your order was still placed successfully — check your email for the confirmation.
          </p>
          <Link to="/menu" className="ghostButton">Back to Menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="confirmationPage">
      <div className="ticket">
        <div className="ticketStub">
          <span className="ticketLabel">Order Slip</span>
          <h2>Order Confirmed</h2>
        </div>

        <p>
          Thanks, {order.customer_name.split(' ')[0]} — order <strong>#{order.id}</strong> is in.
          We're firing up the oven now.
        </p>

        <div className="confirmationItems">
          {order.items.map((item, idx) => (
            <div className="confirmationRow" key={idx}>
              <span>{item.quantity}&times; {item.item_name}</span>
              <span>${(item.unit_price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="confirmationTotal">
          <span>Total</span>
          <span>${Number(order.total_amount).toFixed(2)}</span>
        </div>

        {email && !email.sent && (
          <p className="emailNotice">
            Heads up — we couldn't send a confirmation email right now, but your order is confirmed.
          </p>
        )}
        {email && email.sent && (
          <p className="emailConfirmed">A confirmation email is on its way to {order.customer_email}.</p>
        )}

        <Link to="/menu" className="ghostButton">Order something else</Link>
      </div>
    </div>
  );
}

export default OrderConfirmation;

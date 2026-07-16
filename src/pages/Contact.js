import React, { useState } from "react";
import PizzaLeft from "../assets/pizzaLeft.jpg";
import '../styles/Contact.css';

const initialForm = { name: "", email: "", message: "" };

function validate(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = "Tell us your name.";
  }

  if (!form.email.trim()) {
    errors.email = "We need an email to reply to.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "That email doesn't look right.";
  }

  if (!form.message.trim()) {
    errors.message = "Add a message so we know how to help.";
  } else if (form.message.trim().length < 10) {
    errors.message = "A few more details would help (10+ characters).";
  }

  return errors;
}

function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | sent

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate({ ...form }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    setTouched({ name: true, email: true, message: true });

    if (Object.keys(validationErrors).length > 0) return;

    setStatus("submitting");
    // No backend wired up yet — simulate a network round trip.
    setTimeout(() => {
      setStatus("sent");
    }, 700);
  };

  const handleSendAnother = () => {
    setForm(initialForm);
    setErrors({});
    setTouched({});
    setStatus("idle");
  };

  return (
    <div className="contact">
      <div className="leftSide" style={{ backgroundImage: `url(${PizzaLeft})` }}></div>
      <div className="rightSide">
        {status === "sent" ? (
          <div className="ticket" role="status">
            <div className="ticketStub">
              <span className="ticketLabel">Order Slip</span>
              <h2>Message received</h2>
            </div>
            <p>
              Thanks, {form.name.split(" ")[0] || "friend"} &mdash; we'll get back to
              you at <strong>{form.email}</strong> shortly.
            </p>
            <button type="button" className="ghostButton" onClick={handleSendAnother}>
              Send another message
            </button>
          </div>
        ) : (
          <>
            <h1>Contact Us</h1>
            <form id="contact-form" onSubmit={handleSubmit} noValidate>
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                placeholder="Enter full name..."
                type="text"
                value={form.name}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(touched.name && errors.name)}
              />
              {touched.name && errors.name && (
                <span className="fieldError">{errors.name}</span>
              )}

              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                placeholder="Enter email..."
                type="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(touched.email && errors.email)}
              />
              {touched.email && errors.email && (
                <span className="fieldError">{errors.email}</span>
              )}

              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                rows="6"
                placeholder="Enter message..."
                name="message"
                value={form.message}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(touched.message && errors.message)}
              />
              {touched.message && errors.message && (
                <span className="fieldError">{errors.message}</span>
              )}

              <button type="submit" disabled={status === "submitting"}>
                {status === "submitting" ? "Sending..." : "Send Message"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default Contact;

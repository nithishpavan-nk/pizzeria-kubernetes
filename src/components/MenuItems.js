import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

function MenuItems({ id, image, name, price, description }) {
  const { addItem, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const inCartQuantity = items.find((i) => i.menuItemId === id)?.quantity || 0;

  const handleAdd = () => {
    addItem({ menuItemId: id, name, price, image });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div className='menuItem'>
      <div className="menuItemImage" style={{ backgroundImage: `url(${image})` }} />
      <div className="menuItemBody">
        <h1>{name}</h1>
        {description && <p className="menuItemDescription">{description}</p>}
        <div className="menuItemFooter">
          <p className="menuItemPrice">${price.toFixed(2)}</p>
          <button
            type="button"
            className={`addToCartButton ${justAdded ? "added" : ""}`}
            onClick={handleAdd}
          >
            {justAdded ? "Added ✓" : inCartQuantity > 0 ? `Add another (${inCartQuantity} in cart)` : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuItems;

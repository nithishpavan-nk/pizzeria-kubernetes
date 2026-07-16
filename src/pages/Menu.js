import React, { useState, useMemo, useEffect } from "react";
import { fetchMenu } from "../api/client";
import MenuItem from "../components/MenuItems";
import '../styles/Menu.css';

const FALLBACK_CATEGORIES = ["All", "Classic", "Specialty", "Vegan"];

// Used only if the API is completely unreachable, so the page stays usable offline.
const OFFLINE_MENU = [
  { id: "static-1", name: "Pepperoni Pizza", image_url: "/menu-images/pepperoni.jpg", price: 15.99, category: "Classic", description: "Smoked pepperoni, mozzarella, house tomato sauce." },
  { id: "static-2", name: "Margherita Pizza", image_url: "/menu-images/margherita.jpg", price: 11.99, category: "Classic", description: "San Marzano tomatoes, fresh basil, fior di latte." },
  { id: "static-3", name: "PedroTech Special Pizza", image_url: "/menu-images/pedrotechspecial.jpg", price: 24.99, category: "Specialty", description: "Our chef's signature build, loaded with everything." },
  { id: "static-4", name: "Vegan Pizza", image_url: "/menu-images/vegan.jpg", price: 17.99, category: "Vegan", description: "Roasted vegetables, plant-based cheese, herb oil." },
  { id: "static-5", name: "Pineapple Pizza", image_url: "/menu-images/pineapple.jpg", price: 14.99, category: "Classic", description: "Sweet pineapple, ham, mozzarella. No judgment." },
  { id: "static-6", name: "Truffle Deluxe Pizza", image_url: "/menu-images/expensive.jpg", price: 22.99, category: "Specialty", description: "Truffle oil, wild mushrooms, parmesan shavings." },
];

function Menu() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [menuItems, setMenuItems] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | live | fallback | error

  useEffect(() => {
    let isMounted = true;

    fetchMenu()
      .then((data) => {
        if (!isMounted) return;
        // normalize: API returns price as a string from Postgres numeric — coerce to number
        const normalized = data.map((item) => ({ ...item, price: Number(item.price) }));
        setMenuItems(normalized);
        setStatus("live");
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn("Falling back to static menu — API unavailable:", err.message);
        // Fallback keeps the page usable even if the backend isn't running yet
        setMenuItems(OFFLINE_MENU);
        setStatus("fallback");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const fromData = Array.from(new Set(menuItems.map((i) => i.category))).sort();
    return fromData.length > 0 ? ["All", ...fromData] : FALLBACK_CATEGORIES;
  }, [menuItems]);

  const filteredMenu = useMemo(() => {
    if (activeCategory === "All") return menuItems;
    return menuItems.filter((item) => item.category === activeCategory);
  }, [activeCategory, menuItems]);

  return (
    <div className="menu">
      <h1 className="menuTitle">Our Menu</h1>
      <p className="menuSubtitle">Hand-stretched daily, fired in a real wood oven.</p>

      {status === "fallback" && (
        <p className="menuNotice">
          Showing offline menu — live ordering will resume once our kitchen system reconnects.
        </p>
      )}

      {status === "loading" ? (
        <p className="menuLoading">Loading the menu…</p>
      ) : (
        <>
          <div className="categoryFilters" role="group" aria-label="Filter menu by category">
            {categories.map((category) => (
              <button
                key={category}
                className={`categoryPill ${activeCategory === category ? "active" : ""}`}
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
              >
                {category}
              </button>
            ))}
          </div>

          {filteredMenu.length > 0 ? (
            <div className="menuList">
              {filteredMenu.map((menuItem) => (
                <MenuItem
                  key={menuItem.id}
                  id={menuItem.id}
                  image={menuItem.image_url}
                  name={menuItem.name}
                  price={Number(menuItem.price)}
                  description={menuItem.description}
                />
              ))}
            </div>
          ) : (
            <p className="menuEmpty">No pizzas in this category yet &mdash; check back soon.</p>
          )}
        </>
      )}
    </div>
  );
}

export default Menu;

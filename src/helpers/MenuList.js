import Pepperoni from "../assets/pepperoni.jpg";
import Margherita from "../assets/margherita.jpg";
import PedroTechSpecial from "../assets/pedrotechspecial.jpg";
import Vegan from "../assets/vegan.jpg";
import Pineapple from "../assets/pineapple.jpg";
import Expensive from "../assets/expensive.jpg";

export const MenuList = [
  {
    name: "Pepperoni Pizza",
    image: Pepperoni,
    price: 15.99,
    category: "Classic",
    description: "Smoked pepperoni, mozzarella, house tomato sauce.",
  },
  {
    name: "Margherita Pizza",
    image: Margherita,
    price: 11.99,
    category: "Classic",
    description: "San Marzano tomatoes, fresh basil, fior di latte.",
  },
  {
    name: "PedroTech Special Pizza",
    image: PedroTechSpecial,
    price: 256.53,
    category: "Specialty",
    description: "Our chef's signature build, loaded with everything.",
  },
  {
    name: "Vegan Pizza",
    image: Vegan,
    price: 17.99,
    category: "Vegan",
    description: "Roasted vegetables, plant-based cheese, herb oil.",
  },
  {
    name: "Pineapple Pizza",
    image: Pineapple,
    price: 4.99,
    category: "Classic",
    description: "Sweet pineapple, ham, mozzarella. No judgment.",
  },
  {
    name: "Very Expensive Pizza",
    image: Expensive,
    price: 1997.99,
    category: "Specialty",
    description: "Truffle, gold leaf, and a story for the table.",
  },
];

export const CATEGORIES = ["All", "Classic", "Specialty", "Vegan"];

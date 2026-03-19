import coirRope from "@/assets/product-coir-rope.jpg";
import coirMat from "@/assets/product-coir-mat.jpg";
import coirPot from "@/assets/product-coir-pot.jpg";
import coirNet from "@/assets/product-coir-net.jpg";
import coirBrush from "@/assets/product-coir-brush.jpg";
import coirBlock from "@/assets/product-coir-block.jpg";
import coirBoard from "@/assets/product-coir-board.jpg";
import coirLiner from "@/assets/product-coir-liner.jpg";
import type { Product } from "./types";

export const products: Product[] = [
  {
    id: "1",
    name: "Coir Twine Rope (50m)",
    description: "Strong, biodegradable coconut coir rope ideal for gardening, bundling, and crafts. 50-meter roll.",
    price: 350,
    image: coirRope,
    category: "Gardening",
    stock: 120,
    featured: true,
    tag: "bestseller",
  },
  {
    id: "2",
    name: "Woven Coir Doormat",
    description: "Handwoven natural coir doormat. Durable, weather-resistant, and eco-friendly for any entrance.",
    price: 680,
    image: coirMat,
    category: "Home",
    stock: 85,
    featured: true,
    tag: "trending",
  },
  {
    id: "3",
    name: "Coir Planting Pot (Set of 5)",
    description: "Biodegradable coir pots for seedlings and transplanting. Promotes healthy root growth.",
    price: 250,
    image: coirPot,
    category: "Gardening",
    stock: 200,
    featured: true,
    tag: "new",
  },
  {
    id: "4",
    name: "Coir Erosion Control Net (1x10m)",
    description: "Geotextile coir netting for slope stabilization and erosion control. Construction grade.",
    price: 1200,
    image: coirNet,
    category: "Construction",
    stock: 45,
    featured: true,
    tag: "trending",
  },
  {
    id: "5",
    name: "Natural Coir Scrub Brush",
    description: "Stiff coconut fiber brush with wooden handle. Perfect for heavy-duty cleaning.",
    price: 180,
    image: coirBrush,
    category: "Home",
    stock: 150,
  },
  {
    id: "6",
    name: "Compressed Coir Block (5kg)",
    description: "Expands to 70L of growing medium. Excellent water retention for gardening and hydroponics.",
    price: 420,
    image: coirBlock,
    category: "Gardening",
    stock: 95,
    featured: true,
    tag: "bestseller",
  },
  {
    id: "7",
    name: "Coir Insulation Board (60x120cm)",
    description: "Natural thermal and acoustic insulation panel made from compressed coconut fiber.",
    price: 950,
    image: coirBoard,
    category: "Construction",
    stock: 30,
  },
  {
    id: "8",
    name: "Coir Hanging Basket Liner",
    description: "Pre-formed coconut coir liner for hanging planters. Retains moisture and adds natural beauty.",
    price: 220,
    image: coirLiner,
    category: "Gardening",
    stock: 175,
    tag: "new",
  },
];

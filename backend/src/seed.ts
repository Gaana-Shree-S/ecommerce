import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product";
import User from "./models/User";
import bcrypt from "bcrypt";

dotenv.config();

const sampleProducts = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 6499.99,
    originalPrice: 7999.99,
    image: "/placeholder-nb6yc.png",
    category: "Electronics",
    rating: 4.5,
    inStock: true,
    description:
      "Experience immersive sound with these premium wireless Bluetooth headphones. Designed for comfort and long battery life, perfect for music, calls, and travel.",
  },
  {
    id: 2,
    name: "Premium Cotton T-Shirt",
    price: 1999.99,
    image: "/premium-cotton-t-shirt.png",
    category: "Clothing",
    rating: 4.2,
    inStock: true,
    description:
      "Stay cool and stylish with our premium cotton T-shirt. Made from 100% breathable cotton, offering ultimate comfort and durability for daily wear.",
  },
  {
    id: 3,
    name: "Smart Fitness Watch",
    price: 16499.99,
    originalPrice: 20499.99,
    image: "/smart-fitness-watch.png",
    category: "Electronics",
    rating: 4.7,
    inStock: true,
    description:
      "Track your health and fitness goals with this advanced smart fitness watch. Features heart rate monitoring, step tracking, notifications, and water resistance.",
  },
  {
    id: 4,
    name: "Organic Coffee Beans",
    price: 1549.99,
    image: "/organic-coffee-beans.png",
    category: "Food & Beverage",
    rating: 4.8,
    inStock: false,
    description:
      "Brew the perfect cup with our 100% organic coffee beans. Rich aroma, smooth taste, and ethically sourced for coffee lovers who value quality.",
  },
  {
    id: 5,
    name: "Leather Laptop Bag",
    price: 7299.99,
    originalPrice: 9999.0,
    image: "/leather-laptop-bag.png",
    category: "Accessories",
    rating: 4.3,
    inStock: true,
    description:
      "Crafted from genuine leather, this laptop bag is both stylish and durable. Features padded compartments, multiple pockets, and a professional look.",
  },
  {
    id: 6,
    name: "Wireless Phone Charger",
    price: 2849.99,
    image: "/placeholder-os1yn.png",
    category: "Electronics",
    rating: 4.1,
    inStock: true,
    description:
      "Convenient and fast wireless charging for your smartphone. Sleek design, safe charging technology, and compatible with most Qi-enabled devices.",
  },
  {
    id: 7,
    name: "Yoga Mat Premium",
    price: 3749.99,
    image: "/premium-yoga-mat.png",
    category: "Sports & Fitness",
    rating: 4.6,
    inStock: true,
    description:
      "Enhance your workouts with this premium yoga mat. Extra thick, anti-slip surface provides comfort and stability for yoga, pilates, and floor exercises.",
  },
  {
    id: 8,
    name: "Stainless Steel Water Bottle",
    price: 1849.99,
    originalPrice: 2449.99,
    image: "/stainless-steel-bottle.png",
    category: "Sports & Fitness",
    rating: 4.4,
    inStock: true,
    description:
      "Keep your drinks hot or cold for hours with this insulated stainless steel water bottle. Eco-friendly, reusable, and perfect for workouts or travel.",
  },
]

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI!)
    await Product.deleteMany({})
    await Product.insertMany(sampleProducts)

    // Seed admin user
    await User.deleteMany({ email: "admin@swadeshi.com" })
    const adminPassword = await bcrypt.hash("admin123", 10)
    await User.create({
      name: "Admin",
      email: "admin@swadeshi.com",
      password: adminPassword,
      isAdmin: true,
    })
    console.log("Sample products and admin user added.")
    process.exit()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

seed()

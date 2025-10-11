import fs from "fs/promises";
import crypto from "crypto";

class CartManager {
  constructor(pathFile) {
    this.pathFile = pathFile;
  }

  async readFile() {
    try {
      const data = await fs.readFile(this.pathFile, "utf-8");
      return JSON.parse(data || "[]");
    } catch (error) {
      if (error.code === "ENOENT") return [];
      throw error;
    }
  }

  async writeFile(data) {
    await fs.writeFile(this.pathFile, JSON.stringify(data, null, 2), "utf-8");
  }

  generateNewID() {
    return crypto.randomUUID();
  }

  async createCart() {
    const carts = await this.readFile();

    const newCart = {
      id: this.generateNewID(),
      products: [],
    };

    carts.push(newCart);
    await this.writeFile(carts);

    return newCart;
  }

  async getCartById(cid) {
    const carts = await this.readFile();
    const cart = carts.find((c) => c.id === cid);
    if (!cart) throw new Error("Carrito no encontrado");
    return cart;
  }

  async addProductToCart(cid, pid) {
    const carts = await this.readFile();
    const cartIndex = carts.findIndex((c) => c.id === cid);

    if (cartIndex === -1) throw new Error("Carrito no encontrado");

    const cart = carts[cartIndex];

    const productIndex = cart.products.findIndex((p) => p.product === pid);

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    carts[cartIndex] = cart;
    await this.writeFile(carts);

    return cart;
  }
}

export default CartManager;

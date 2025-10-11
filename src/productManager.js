import fs from "fs/promises";
import crypto from "crypto";

class ProductManager {
  constructor(pathFile) {
    this.pathFile = pathFile;
  }

  generateNewID() {
    return crypto.randomUUID();
  }

  async readFile() {
    try {
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      return JSON.parse(fileData || "[]");
    } catch (error) {
      if (error.code === "ENOENT") return [];
      throw new Error("Error al leer el archivo: " + error.message);
    }
  }

  async writeFile(data) {
    try {
      await fs.writeFile(this.pathFile, JSON.stringify(data, null, 2), "utf-8");
    } catch (error) {
      throw new Error("Error al escribir en el archivo: " + error.message);
    }
  }

  async addProduct(newProduct) {
    try {
      const products = await this.readFile();

      if (products.some((p) => p.title === newProduct.title)) {
        throw new Error("El producto ya existe");
      }

      const newID = this.generateNewID();

      const product = { id: newID, ...newProduct };

      products.push(product);

      await this.writeFile(products);

      return products;
    } catch (error) {
      throw new Error("Error al añadir el nuevo producto: " + error.message);
    }
  }

  async getProducts() {
    try {
      const products = await this.readFile();

      return products;
    } catch (error) {
      throw new Error("Error al mostrar los productos: " + error.message);
    }
  }

  async getProductsByID(pid) {
    try {
      const products = await this.readFile();

      const indexProduct = products.findIndex((product) => product.id === pid);
      if (indexProduct === -1) throw new Error("Producto no encontrado");

      return products[indexProduct];
    } catch (error) {
      throw new Error("Error al mostrar el producto: " + error.message);
    }
  }

  async setProductByID(pid, updates) {
    try {
      const products = await this.readFile();

      const indexProduct = products.findIndex((product) => product.id === pid);
      if (indexProduct === -1) throw new Error("Producto no encontrado");

      products[indexProduct] = { ...products[indexProduct], ...updates };

      await this.writeFile(products);

      return products;
    } catch (error) {
      throw new Error("Error al actualizar el producto: " + error.message);
    }
  }

  async deleteProductByID(pid) {
    try {
      const products = await this.readFile();

      const filteredProducts = products.filter((product) => product.id !== pid);

      await this.writeFile(filteredProducts);

      return filteredProducts;
    } catch (error) {
      throw new Error("Error al eliminar el producto: " + error.message);
    }
  }
}

export default ProductManager;

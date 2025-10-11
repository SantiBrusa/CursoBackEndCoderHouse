import express from "express";
import ProductManager from "./productManager.js";
import CartManager from "./cartManager.js";

const app = express();
app.use(express.json());
const productManager = new ProductManager("./src/products.json");
const cartManager = new CartManager("./src/carts.json");

app.get("/api/products", async (req, res) => {
  try {
    const products = await productManager.getProducts();

    res.status(200).json({ message: "Lista de Productos", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/products/:pid", async (req, res) => {
  try {
    const product = await productManager.getProductsByID(pid);

    res.status(200).json({ message: "Producto Encontrado", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const newProduct = req.body;
    const products = await productManager.addProduct(newProduct);
    res.status(201).json({ message: "Se Añadio el producto", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const updates = req.body;

    if ("id" in updates) {
      delete updates.id;
    }

    const products = await productManager.setProductByID(pid, updates);
    res.status(200).json({ message: "Producto Actualizado", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/api/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;

    const products = await productManager.deleteProductByID(pid);

    res.status(200).json({ message: "Producto eliminado", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//

app.post("/api/carts", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json({ message: "Carrito creado", cart: newCart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/carts/:cid", async (req, res) => {
  try {
    const cart = await cartManager.getCartById(cid);

    res.status(200).json({ message: "Carrito encontrado", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/carts/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const products = await productManager.getProducts();
    if (!products.find((p) => p.id === pid))
      throw new Error("Producto no existe");

    const updatedCart = await cartManager.addProductToCart(cid, pid);
    res.status(201).json({ message: "producto añadido", updatedCart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(8080, () => {
  console.log("Server iniciado!");
});

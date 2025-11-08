import { Router } from "express";
import ProductManager from "../productManager.js";
import uploader from "../utils/uploader.js";
import { io } from "../app.js";

const router = Router();
const productManager = new ProductManager("./src/products.json");

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.status(200).json({ message: "Lista de Productos", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = await productManager.getProductsByID(pid);
    res.status(200).json({ message: "Producto Encontrado", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", uploader.single("thumbnail"),async (req, res) => {
  try {
    const {
      title,
      price,
      description,
      category,
      stock,
      code
    } = req.body;

    let thumbnail = null;
    if (req.file) {
      thumbnail = "/img/" + req.file.filename;
    }

    const newProduct = {
      title,
      description,
      code,
      category,
      price: Number(price),
      stock: Number(stock),
      thumbnail,
    };

    await productManager.addProduct(newProduct);

    const updatedProducts = await productManager.getProducts();
    io.emit("updateProducts", updatedProducts);

    res.redirect("/realtimeproducts");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const products = await productManager.deleteProductByID(pid);

    io.emit("updateProducts", products);

    res.status(200).json({ message: "Producto eliminado", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

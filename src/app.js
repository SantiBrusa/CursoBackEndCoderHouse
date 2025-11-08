import express from "express";
import http from "http";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import viewsRouter from "./routes/views.route.js";
import productsRouter from "./routes/products.route.js";
import CartManager from "./cartManager.js";
import ProductManager from "./productManager.js";


const app = express();
const server = http.createServer(app);
const productManager = new ProductManager("./src/products.json");

export const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use(express.static("public"));

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);

server.listen(8080, () => {
  console.log("Servidor Iniciado");
});

io.on("connection", (socket) => {
  console.log("Cliente conectado ✅");

  socket.on("deleteProductFromClient", async (productId) => {
    await productManager.deleteProductByID(productId);
    const updatedProducts = await productManager.getProducts();
    io.emit("updateProducts", updatedProducts);
  });
});

// 

const cartManager = new CartManager("./src/carts.json");

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

// 


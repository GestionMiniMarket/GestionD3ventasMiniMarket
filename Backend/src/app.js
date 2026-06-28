const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

const productosRoutes = require('./routes/productosRoutes');
app.use('/api/productos', productosRoutes);

const categoriasRoutes = require('./routes/categoriasRoutes');
app.use('/api/categorias', categoriasRoutes);

const inventarioRoutes = require('./routes/inventarioRoutes');
app.use('/api/inventario', inventarioRoutes);

const cajasRoutes = require('./routes/cajasRoutes');
const ventasRoutes = require('./routes/ventasRoutes');

app.use('/api/cajas', cajasRoutes);
app.use('/api/ventas', ventasRoutes);

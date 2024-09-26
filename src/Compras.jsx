import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Modal,
    Typography,
    TextField,
    Box,
    Select,
    MenuItem,
    Snackbar,
} from '@mui/material';
import { toast } from 'react-toastify';

const baseUrl = 'http://localhost:3000/api/Compras';
const proveedoresUrl = 'http://localhost:3000/api/Proveedores';
const productosServiciosUrl = 'http://localhost:3000/api/ProductoServicio';

const Compras = () => {
    const [data, setData] = useState([]);
    const [productosServicios, setProductosServicios] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [modalCrearCompra, setModalCrearCompra] = useState(false);
    const [nuevaCompra, setNuevaCompra] = useState({
        Proveedores_id: '',
        productos: [{ ProductoServicio_id: '', Stock: 0, Subtotal: 0 }],
        Total: 0,
        Estado: 'Pendiente',
    });
    const [errores, setErrores] = useState([]);
    const [snackOpen, setSnackOpen] = useState(false);

    useEffect(() => {
        fetchData();
        fetchProductosServicios();
        fetchProveedores();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(baseUrl);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Error al cargar los datos.');
        }
    };

    const fetchProductosServicios = async () => {
        try {
            const response = await axios.get(productosServiciosUrl);
            setProductosServicios(response.data);
        } catch (error) {
            console.error('Error fetching productos/servicios:', error);
            toast.error('Error al cargar productos/servicios.');
        }
    };

    const fetchProveedores = async () => {
        try {
            const response = await axios.get(proveedoresUrl);
            setProveedores(response.data);
        } catch (error) {
            console.error('Error fetching proveedores:', error);
            toast.error('Error al cargar proveedores.');
        }
    };

    const abrirModalCrearCompra = () => {
        setModalCrearCompra(true);
    };

    const cerrarModalCrearCompra = () => {
        setModalCrearCompra(false);
        setNuevaCompra({
            Proveedores_id: '',
            productos: [{ ProductoServicio_id: '', Stock: 0, Subtotal: 0 }],
            Total: 0,
            Estado: 'Pendiente',
        });
        setErrores([]);
    };

    const agregarProducto = () => {
        setNuevaCompra({
            ...nuevaCompra,
            productos: [...nuevaCompra.productos, { ProductoServicio_id: '', Stock: 0, Subtotal: 0 }],
        });
    };

    const calcularSubtotal = (index) => {
        const productoSeleccionado = productosServicios.find(
            producto => producto._id === nuevaCompra.productos[index].ProductoServicio_id
        );

        if (productoSeleccionado) {
            const stock = nuevaCompra.productos[index].Stock || 0;
            const subtotal = productoSeleccionado.Precio * stock;

            const nuevosProductos = [...nuevaCompra.productos];
            nuevosProductos[index].Subtotal = subtotal;

            setNuevaCompra(prevState => {
                const updatedCompra = { ...prevState, productos: nuevosProductos };
                actualizarTotal(updatedCompra);
                return updatedCompra;
            });
        }
    };

    const actualizarTotal = (compra) => {
        const total = compra.productos.reduce((acc, producto) => acc + producto.Subtotal, 0);
        setNuevaCompra(prevState => ({ ...prevState, Total: total }));
    };

    const handleProductoChange = (index, value) => {
        const nuevosProductos = [...nuevaCompra.productos];
        nuevosProductos[index].ProductoServicio_id = value;
        nuevosProductos[index].Stock = 0;
        nuevosProductos[index].Subtotal = 0;

        setNuevaCompra({ ...nuevaCompra, productos: nuevosProductos });
        calcularSubtotal(index);
    };

    const handleStockChange = (index, value) => {
        const nuevosProductos = [...nuevaCompra.productos];
        nuevosProductos[index].Stock = Number(value);

        setNuevaCompra({ ...nuevaCompra, productos: nuevosProductos });
        calcularSubtotal(index);
    };

    const validarFormulario = () => {
        const errores = [];

        if (!nuevaCompra.Proveedores_id) {
            errores.push('El proveedor es requerido.');
        }

        if (nuevaCompra.productos.length === 0) {
            errores.push('Debes agregar al menos un producto.');
        } else {
            nuevaCompra.productos.forEach((producto, index) => {
                if (!producto.ProductoServicio_id) {
                    errores.push(`El producto en la posición ${index + 1} es requerido.`);
                }
                if (producto.Stock <= 0) {
                    errores.push(`El stock en la posición ${index + 1} debe ser mayor a 0.`);
                }
            });
        }

        if (nuevaCompra.Total <= 0) {
            errores.push('El total debe ser mayor a 0.');
        }

        if (errores.length > 0) {
            setErrores(errores);
            return false;
        }

        setErrores([]);
        return true;
    };

    const crearCompra = async () => {
        const esFormularioValido = validarFormulario();
        if (!esFormularioValido) {
            return;
        }

        const compraData = {
            Proveedores_id: nuevaCompra.Proveedores_id,
            productos: nuevaCompra.productos.map(producto => ({
                ProductoServicio_id: producto.ProductoServicio_id,
                Stock: producto.Stock,
                SubTotal: producto.Subtotal,
            })),
            Estado: nuevaCompra.Estado,
            Total: nuevaCompra.Total,
        };

        // Log para depurar los datos antes de enviarlos
        console.log('Datos que se envían:', compraData);

        try {
            const response = await axios.post(baseUrl, compraData);
            console.log('Respuesta exitosa del servidor:', response.data);
            toast.success('Compra creada exitosamente.');
            fetchData();
            cerrarModalCrearCompra();
        } catch (error) {
            console.log('Error en el POST:', error.response ? error.response.data : error.message);

            if (error.response && error.response.data && error.response.data.message) {
                toast.error(`Error: ${error.response.data.message}`);
            } else {
                toast.error('Error al crear la compra.');
            }
        }
    };

    const handleTotalChange = (value) => {
        setNuevaCompra(prevState => ({
            ...prevState,
            Total: Number(value)
        }));
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <Button
                variant="contained"
                color="primary"
                onClick={abrirModalCrearCompra}
                style={{ marginBottom: '20px' }}
            >
                Crear Compra
            </Button>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Proveedor</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Estado</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map(compra => (
                            <TableRow key={compra._id}>
                                <TableCell>
                                    {proveedores.find(proveedor => proveedor._id === compra.Proveedores_id)?.Nombre || 'Proveedor no encontrado'}
                                </TableCell>
                                <TableCell>{compra.Total}</TableCell>
                                <TableCell>{compra.Estado}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal
                open={modalCrearCompra}
                onClose={cerrarModalCrearCompra}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={{ 
                    padding: '20px', 
                    backgroundColor: 'white', 
                    borderRadius: '8px', 
                    width: '400px', 
                    margin: 'auto', 
                    marginTop: '100px',
                    overflowY: 'auto',
                    maxHeight: '70vh', // Máxima altura del modal
                }}>
                    <Typography id="modal-title" variant="h6" component="h2">
                        Crear Compra
                    </Typography>

                    {/* Contenedor con barra de desplazamiento */}
                    <Box sx={{ maxHeight: '50vh', overflowY: 'auto', marginBottom: '10px' }}>
                        <TextField
                            select
                            label="Proveedor"
                            value={nuevaCompra.Proveedores_id}
                            onChange={(e) => setNuevaCompra({ ...nuevaCompra, Proveedores_id: e.target.value })}
                            fullWidth
                            margin="normal"
                        >
                            {proveedores.map(proveedor => (
                                <MenuItem key={proveedor._id} value={proveedor._id}>{proveedor.Nombre}</MenuItem>
                            ))}
                        </TextField>

                        {nuevaCompra.productos.map((producto, index) => (
                            <div key={index} style={{ marginBottom: '10px' }}>
                                <TextField
                                    select
                                    label="Producto/Servicio"
                                    value={producto.ProductoServicio_id}
                                    onChange={(e) => handleProductoChange(index, e.target.value)}
                                    fullWidth
                                    margin="normal"
                                >
                                    {productosServicios.map(productoServicio => (
                                        <MenuItem key={productoServicio._id} value={productoServicio._id}>
                                            {productoServicio.Nombre}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    label="Stock"
                                    type="number"
                                    value={producto.Stock}
                                    onChange={(e) => handleStockChange(index, e.target.value)}
                                    fullWidth
                                    margin="normal"
                                />
                                <Typography variant="body2">Subtotal: {producto.Subtotal}</Typography>
                            </div>
                        ))}

                        <Button variant="outlined" onClick={agregarProducto}>Agregar Producto</Button>

                        <TextField
                            label="Total"
                            type="number"
                            value={nuevaCompra.Total}
                            onChange={(e) => handleTotalChange(e.target.value)}
                            fullWidth
                            margin="normal"
                            disabled
                        />
                    </Box>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={crearCompra}
                        fullWidth
                        style={{ marginTop: '10px' }}
                    >
                        Crear
                    </Button>

                    {errores.length > 0 && (
                        <Box sx={{ marginTop: '10px' }}>
                            {errores.map((error, index) => (
                                <Typography key={index} variant="body2" color="error">
                                    {error}
                                </Typography>
                            ))}
                        </Box>
                    )}
                </Box>
            </Modal>

            <Snackbar
                open={snackOpen}
                autoHideDuration={6000}
                onClose={() => setSnackOpen(false)}
                message="Compra creada exitosamente."
            />
        </div>
    );
};

export default Compras;


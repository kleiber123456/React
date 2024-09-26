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
    TablePagination,
    Select,
    MenuItem,
} from '@mui/material';
import { toast } from 'react-toastify';
import { Edit, Delete } from '@mui/icons-material';

const baseUrl = 'http://localhost:3000/api/Ventas';
const clientesUrl = 'http://localhost:3000/api/Clientes';
const productosServiciosUrl = 'http://localhost:3000/api/ProductoServicio';
const proveedoresUrl = 'http://localhost:3000/api/Proveedores';

const Ventas = () => {
    const [data, setData] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [productosServicios, setProductosServicios] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);
    const [modalAnular, setModalAnular] = useState(false);
    const [modalCrearVenta, setModalCrearVenta] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [nuevaVenta, setNuevaVenta] = useState({
        Cliente_id: '',
        ProductoServicio_id: '',
        Proveedor_id: '',
        FechaVenta: '',
        Total: 0,
        Cantidad: 0,
        Estado: 'Pendiente' // Estado inicial
    });

    useEffect(() => {
        fetchData();
        fetchClientes();
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

    const fetchClientes = async () => {
        try {
            const response = await axios.get(clientesUrl);
            setClientes(response.data);
        } catch (error) {
            console.error('Error fetching clientes:', error);
            toast.error('Error al cargar los clientes.');
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

    const abrirModal = (tipo) => {
        switch (tipo) {
            case 'Editar':
                setModalEditar(true);
                break;
            case 'Eliminar':
                setModalEliminar(true);
                break;
            case 'Anular':
                setModalAnular(true);
                break;
            case 'Crear Venta':
                setModalCrearVenta(true);
                break;
            default:
                break;
        }
    };

    const cerrarModal = (tipo) => {
        switch (tipo) {
            case 'Editar':
                setModalEditar(false);
                break;
            case 'Eliminar':
                setModalEliminar(false);
                break;
            case 'Anular':
                setModalAnular(false);
                break;
            case 'Crear Venta':
                setModalCrearVenta(false);
                break;
            default:
                break;
        }
        setClienteSeleccionado(null);
    };

    const editarCliente = async () => {
        try {
            await axios.put(`${baseUrl}/${clienteSeleccionado._id}`, clienteSeleccionado);
            const nuevoArray = data.map(cliente =>
                cliente._id === clienteSeleccionado._id ? clienteSeleccionado : cliente
            );
            setData(nuevoArray);
            toast.success('Cliente editado exitosamente.');
            cerrarModal('Editar');
        } catch (error) {
            console.error('Error editing client:', error);
            toast.error('Error al editar cliente.');
        }
    };

    const eliminarCliente = async () => {
        try {
            await axios.delete(`${baseUrl}/${clienteSeleccionado._id}`);
            const nuevoArray = data.filter(cliente => cliente._id !== clienteSeleccionado._id);
            setData(nuevoArray);
            toast.success('Cliente eliminado exitosamente.');
            cerrarModal('Eliminar');
        } catch (error) {
            console.error('Error deleting client:', error);
            toast.error('Error al eliminar cliente.');
        }
    };

    const anularCliente = async () => {
        try {
            await axios.put(`${baseUrl}/${clienteSeleccionado._id}`, {
                ...clienteSeleccionado,
                Estado: 'Anulado'
            });
            const nuevoArray = data.map(cliente => {
                if (cliente._id === clienteSeleccionado._id) {
                    return { ...cliente, Estado: 'Anulado' };
                }
                return cliente;
            });
            setData(nuevoArray);
            toast.success('Cliente anulado exitosamente.');
            cerrarModal('Anular');
        } catch (error) {
            console.error('Error al anular cliente:', error);
            toast.error('Error al anular cliente.');
        }
    };

    const crearVenta = async () => {
        const productoSeleccionado = productosServicios.find(producto => producto._id === nuevaVenta.ProductoServicio_id);
        if (!productoSeleccionado || nuevaVenta.Cantidad > productoSeleccionado.Stock) {
            toast.error('Cantidad supera el stock disponible.');
            return;
        }

        if (!nuevaVenta.Cliente_id || !nuevaVenta.ProductoServicio_id || !nuevaVenta.FechaVenta || !nuevaVenta.Total || !nuevaVenta.Cantidad) {
            toast.error('Por favor completa todos los campos requeridos.');
            return;
        }

        const estadosPermitidos = ['Pendiente', 'Completado', 'Anulado'];
        if (!estadosPermitidos.includes(nuevaVenta.Estado)) {
            toast.error('Estado no válido.');
            return;
        }

        try {
            const ventaData = {
                Cliente_id: nuevaVenta.Cliente_id,
                ProductoServicio_id: nuevaVenta.ProductoServicio_id,
                Proveedor_id: nuevaVenta.Proveedor_id,
                FechaVenta: new Date(nuevaVenta.FechaVenta),
                Total: nuevaVenta.Total,
                Cantidad: nuevaVenta.Cantidad,
                Estado: nuevaVenta.Estado
            };

            await axios.post(baseUrl, ventaData);
            toast.success('Venta creada exitosamente.');
            fetchData();
            cerrarModal('Crear Venta');
            setNuevaVenta({
                Cliente_id: '',
                ProductoServicio_id: '',
                Proveedor_id: '',
                FechaVenta: '',
                Total: 0,
                Cantidad: 0,
                Estado: 'Pendiente'
            });
        } catch (error) {
            console.error('Error creating sale:', error);
            toast.error('Error al crear la venta.');
        }
    };

    const calcularTotal = () => {
        const productoSeleccionado = productosServicios.find(producto => producto._id === nuevaVenta.ProductoServicio_id);
        if (productoSeleccionado) {
            const total = productoSeleccionado.Precio * nuevaVenta.Cantidad;
            setNuevaVenta({ ...nuevaVenta, Total: total });
        }
    };

    useEffect(() => {
        calcularTotal();
    }, [nuevaVenta.Cantidad, nuevaVenta.ProductoServicio_id]);

    return (
        <div>
            <TextField
                label="Buscar Cliente"
                variant="outlined"
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button onClick={() => abrirModal('Crear Venta')}>Crear Venta</Button>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Clientes ID</TableCell>
                            <TableCell>Fecha de Venta</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Producto/Servicio ID</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.filter(cliente => {
                            // Asegurarse de que cliente.Cliente_id esté definido y es un string
                            return (
                                cliente.Cliente_id &&
                                cliente.Cliente_id.toString().includes(searchTerm)
                            );
                        }).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(cliente => (
                            <TableRow key={cliente._id}>
                                <TableCell>{cliente.Cliente_id}</TableCell>
                                <TableCell>{new Date(cliente.FechaVenta).toLocaleDateString()}</TableCell>
                                <TableCell>{cliente.Total}</TableCell>
                                <TableCell>{cliente.Estado}</TableCell>
                                <TableCell>{cliente.ProductoServicio_id}</TableCell>
                                <TableCell>
                                    <Button onClick={() => { setClienteSeleccionado(cliente); abrirModal('Editar'); }}><Edit /></Button>
                                    <Button onClick={() => { setClienteSeleccionado(cliente); abrirModal('Eliminar'); }}>Eliminar</Button>
                                    <Button onClick={() => { setClienteSeleccionado(cliente); abrirModal('Anular'); }}>Anular</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 10));
                    setPage(0);
                }}
            />

            <Modal open={modalCrearVenta} onClose={() => cerrarModal('Crear Venta')}>
                <div>
                    <Typography variant="h6">Crear Venta</Typography>
                    <Select
                        label="Cliente"
                        value={nuevaVenta.Cliente_id}
                        onChange={(e) => setNuevaVenta({ ...nuevaVenta, Cliente_id: e.target.value })}
                    >
                        {clientes.map(cliente => (
                            <MenuItem key={cliente._id} value={cliente._id}>{cliente.Nombre}</MenuItem>
                        ))}
                    </Select>
                    <Select
                        label="Producto/Servicio"
                        value={nuevaVenta.ProductoServicio_id}
                        onChange={(e) => setNuevaVenta({ ...nuevaVenta, ProductoServicio_id: e.target.value })}
                    >
                        {productosServicios.map(producto => (
                            <MenuItem key={producto._id} value={producto._id}>{producto.Nombre}</MenuItem>
                        ))}
                    </Select>
                    <TextField
                        label="Cantidad"
                        type="number"
                        value={nuevaVenta.Cantidad}
                        onChange={(e) => setNuevaVenta({ ...nuevaVenta, Cantidad: e.target.value })}
                    />
                    <TextField
                        label="Fecha de Venta"
                        type="date"
                        value={nuevaVenta.FechaVenta}
                        onChange={(e) => setNuevaVenta({ ...nuevaVenta, FechaVenta: e.target.value })}
                    />
                    <TextField
                        label="Total"
                        type="number"
                        value={nuevaVenta.Total}
                        onChange={(e) => setNuevaVenta({ ...nuevaVenta, Total: e.target.value })}
                        disabled
                    />
                    <Button onClick={crearVenta}>Guardar Venta</Button>
                </div>
            </Modal>

            <Modal open={modalEditar} onClose={() => cerrarModal('Editar')}>
                <div>
                    <Typography variant="h6">Editar Cliente</Typography>
                    <TextField
                        label="ID Cliente"
                        value={clienteSeleccionado?.Cliente_id}
                        onChange={(e) => setClienteSeleccionado({ ...clienteSeleccionado, Cliente_id: e.target.value })}
                    />
                    <Button onClick={editarCliente}>Guardar Cambios</Button>
                </div>
            </Modal>

            <Modal open={modalEliminar} onClose={() => cerrarModal('Eliminar')}>
                <div>
                    <Typography variant="h6">Eliminar Cliente</Typography>
                    <Typography>¿Estás seguro de que deseas eliminar este cliente?</Typography>
                    <Button onClick={eliminarCliente}>Eliminar</Button>
                </div>
            </Modal>

            <Modal open={modalAnular} onClose={() => cerrarModal('Anular')}>
                <div>
                    <Typography variant="h6">Anular Cliente</Typography>
                    <Typography>¿Estás seguro de que deseas anular este cliente?</Typography>
                    <Button onClick={anularCliente}>Anular</Button>
                </div>
            </Modal>
        </div>
    );
};

export default Ventas;


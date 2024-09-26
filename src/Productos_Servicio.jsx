import React, { useEffect, useState } from 'react';
import './PyS.css';
import axios from 'axios';
import { Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Modal, Button, TextField, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { makeStyles } from '@mui/styles';

const baseUrl = 'http://localhost:3000/api/ProductoServicio';

const useStyles = makeStyles(() => ({
  search: { marginBottom: '20px', width: '50%' },
  button: { margin: '20px 0' }, // Estilos adicionales para el botón agregar
}));

function App({theme}) {
  const styles = useStyles();
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [recordsToShow, setRecordsToShow] = useState(10);
    
  const [productoSeleccionado, setProductoSeleccionado] = useState({
    _id: '',
    Nombre: '',
    Descripcion: '',
    Costo:'',
    Precio: '',
    Stock: '',
    Subtotal: '',
    Tipo: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setProductoSeleccionado(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Calcular el precio automáticamente como el 10% del costo
    if (name === 'Costo') {
      const costo = Number(value);
      const precio = costo + (costo * 0.10); // Añadir el 10% al costo
      setProductoSeleccionado(prevState => ({
        ...prevState,
        Precio: precio,  // Precio calculado automáticamente
        Subtotal: precio * (prevState.Stock || 0) // Recalcular el subtotal
      }));
    }

    // Actualizar el subtotal automáticamente cuando cambian Precio o Stock
    if (name === 'Stock') {
      const stock = Number(value);
      const precio = productoSeleccionado.Precio;
      setProductoSeleccionado(prevState => ({
        ...prevState,
        Subtotal: precio * stock
      }));
    }
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleRecordsChange = (e) => setRecordsToShow(parseInt(e.target.value, 10));

  const peticionGet = async () => {
    try {
      const response = await axios.get(baseUrl);
      setData(response.data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      toast.error('Error al obtener los datos.');
    }
  };

  const peticionPost = async () => {
    const { _id, Nombre, Descripcion, Precio, Stock, Tipo, Costo } = productoSeleccionado;

    if (!_id || !Nombre || !Costo || !Stock || !Tipo) {
      toast.error('Por favor, completa todos los campos requeridos.');
      return;
    }

    const producto = {
      _id,
      Nombre,
      Descripcion,
      Costo: Number(Costo),
      Precio: Number(Precio),
      Stock: Number(Stock),
      Subtotal: Number(Precio) * Number(Stock),
      Tipo,
    };

    try {
      const response = await axios.post(baseUrl, producto, {
        headers: { 'Content-Type': 'application/json' },
      });
      setData([...data, response.data]);
      abrirCerrarModalInsertar();
      toast.success('Producto agregado correctamente!');
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      toast.error('Error al agregar el producto.');
    }
  };

  const peticionPut = async () => {
    const productoActualizado = {
      _id: productoSeleccionado._id,
      Nombre: productoSeleccionado.Nombre,
      Descripcion: productoSeleccionado.Descripcion,
      Costo: productoSeleccionado.Costo,
      Precio: productoSeleccionado.Precio,
      Stock: productoSeleccionado.Stock,
      Subtotal: productoSeleccionado.Precio * productoSeleccionado.Stock,
      Tipo: productoSeleccionado.Tipo,
    };

    try {
      await axios.put(`${baseUrl}/${productoSeleccionado._id}`, productoActualizado, {
        headers: { 'Content-Type': 'application/json' },
      });

      const dataNueva = data.map(producto =>
        producto._id === productoSeleccionado._id ? productoActualizado : producto
      );
      setData(dataNueva);
      abrirCerrarModalEditar();
      toast.success('Producto editado correctamente!');
    } catch (error) {
      console.error("Error al editar el producto:", error);
      toast.error('Error al editar el producto.');
    }
  };

  const peticionDelete = async () => {
    try {
      await axios.delete(`${baseUrl}/${productoSeleccionado._id}`);
      setData(data.filter(producto => producto._id !== productoSeleccionado._id));
      abrirCerrarModalEliminar();
      toast.success('Producto eliminado correctamente!');
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      toast.error('Error al eliminar el producto.');
    }
  };

  const abrirCerrarModalInsertar = () => setModalInsertar(!modalInsertar);
  const abrirCerrarModalEditar = () => setModalEditar(!modalEditar);
  const abrirCerrarModalEliminar = () => setModalEliminar(!modalEliminar);

  const seleccionarProducto = (producto, caso) => {
    setProductoSeleccionado(producto);
    caso === 'Editar' ? abrirCerrarModalEditar() : abrirCerrarModalEliminar();
  };

  useEffect(() => {
    peticionGet();
  }, []);

  const filteredData = data.filter(producto => 
    (producto._id && producto._id.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (producto.Nombre && producto.Nombre.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (producto.Descripcion && producto.Descripcion.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (producto.Costo && producto.Costo.toString().includes(searchTerm)) || 
    (producto.Precio && producto.Precio.toString().includes(searchTerm)) || 
    (producto.Stock && producto.Stock.toString().includes(searchTerm)) || 
    (producto.Subtotal && producto.Subtotal.toString().includes(searchTerm)) || 
    (producto.Tipo && producto.Tipo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const displayedData = filteredData.slice(0, recordsToShow);

  const bodyInsertar = (
    <div className={`contenedorAgregar ${theme}`}>
      <h1>Agregar Nuevo Producto</h1>
      <div className={`todo ${theme}`}>
        <TextField sx={{mr:2, mt:2}} name="_id" className="opcion" label="_id" required onChange={handleChange} />
        <br />
        <TextField sx={{mr:2, mt:2}} name="Nombre" className="opcion" label="Nombre" onChange={handleChange}  />
        <br />
        <TextField sx={{mr:2, mt:2}} name="Descripcion" className="opcion" label="Descripción" onChange={handleChange} />
        <br />
        <TextField sx={{mr:2, mt:2}} name="Costo" className="Costo" label="Costo" onChange={handleChange} />
        <br />
        <TextField sx={{mr:2, mt:2}} name="Precio" className="opcion" label="Precio" value={productoSeleccionado.Precio} disabled /> {/* Campo deshabilitado */}
        <br />
        <TextField sx={{mr:2, mt:2}} name="Stock" className="opcion" label="Stock" onChange={handleChange} />
        <br />
        <FormControl sx={{mr:2, mt:2, minWidth: 120}}>
          <InputLabel>Tipo</InputLabel>
          <Select name="Tipo" value={productoSeleccionado.Tipo} onChange={handleChange}>
            <MenuItem value="Producto">Producto</MenuItem>
            <MenuItem value="Servicio">Servicio</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div align="right">
        <Button color="primary" onClick={peticionPost}>Insertar</Button>
        <Button onClick={abrirCerrarModalInsertar}>Cancelar</Button>
      </div>
    </div>
  );

  const bodyEditar = (
    <div className='contenedorEditar'>
      <h1>Editar Producto</h1>
      <div className={`todo ${theme}`}>
        <TextField sx={{mr:2, mt:2}} name="Nombre" className="opcion" label="Nombre" onChange={handleChange} value={productoSeleccionado && productoSeleccionado.Nombre} />
        <br />
        <TextField sx={{mr:2, mt:2}} name="Descripcion" className="opcion" label="Descripción" onChange={handleChange} value={productoSeleccionado && productoSeleccionado.Descripcion} />
        <br />
        <TextField sx={{mr:2, mt:2}} name="Costo" className="Costo" label="Costo" onChange={handleChange} value={productoSeleccionado.Costo} />
        <br />
        <TextField sx={{mr:2, mt:2}} name="Precio" className="opcion" label="Precio" value={productoSeleccionado.Precio} disabled />
        <br />
        <TextField sx={{mr:2, mt:2}} name="Stock" className="opcion" label="Stock" onChange={handleChange} value={productoSeleccionado.Stock} />
        <br />
        <FormControl sx={{mr:2, mt:2, minWidth: 120}}>
          <InputLabel>Tipo</InputLabel>
          <Select name="Tipo" value={productoSeleccionado.Tipo} onChange={handleChange}>
            <MenuItem value="Producto">Producto</MenuItem>
            <MenuItem value="Servicio">Servicio</MenuItem>
          </Select>
        </FormControl>
        <br />
      </div>
      <div align="right">
        <Button color="primary" onClick={peticionPut}>Editar</Button>
        <Button onClick={abrirCerrarModalEditar}>Cancelar</Button>
      </div>
    </div>
  );

  const bodyEliminar = (
    <div className='contenedorEliminar'>
      <p>¿Estás seguro que deseas eliminar el producto <b>{productoSeleccionado && productoSeleccionado.Nombre}</b>?</p>
      <div align="right">
        <Button color="secondary" onClick={peticionDelete}>Sí</Button>
        <Button onClick={abrirCerrarModalEliminar}>No</Button>
      </div>
    </div>
  );

  return (
    <div className={`contenedor ${theme}`}>
      <ToastContainer />
      <Typography variant="h4">Productos y Servicios</Typography>

      <TextField
        className={styles.search}
        label="Buscar"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearch}
      />

      <Button variant="contained" color="primary" className={styles.button} onClick={abrirCerrarModalInsertar}>
        Agregar Producto/Servicio
      </Button>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>_id</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Costo</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Subtotal</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {displayedData.map((producto) => (
              <TableRow key={producto._id}>
                <TableCell>{producto._id}</TableCell>
                <TableCell>{producto.Nombre}</TableCell>
                <TableCell>{producto.Descripcion}</TableCell>
                <TableCell>{producto.Costo}</TableCell>
                <TableCell>{producto.Precio}</TableCell>
                <TableCell>{producto.Stock}</TableCell>
                <TableCell>{producto.Subtotal}</TableCell>
                <TableCell>{producto.Tipo}</TableCell>
                <TableCell>
                  <Edit onClick={() => seleccionarProducto(producto, 'Editar')} />
                  <Delete onClick={() => seleccionarProducto(producto, 'Eliminar')} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={modalInsertar} onClose={abrirCerrarModalInsertar}>
        {bodyInsertar}
      </Modal>

      <Modal open={modalEditar} onClose={abrirCerrarModalEditar}>
        {bodyEditar}
      </Modal>

      <Modal open={modalEliminar} onClose={abrirCerrarModalEliminar}>
        {bodyEliminar}
      </Modal>
    </div>
  );
}

export default App;




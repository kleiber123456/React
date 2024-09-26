import React, { useEffect, useState } from 'react';
import './PyS.css';
import axios from 'axios';
import { Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Modal, Button, TextField, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const baseUrl = 'http://localhost:3000/api/Clientes';

const useStyles = makeStyles(() => ({
  search: { marginBottom: '20px', width: '50%' },
}));

function Clientes({ theme }) {
  const styles = useStyles();
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [recordsToShow, setRecordsToShow] = useState(10);

  const [clienteSeleccionado, setClienteSeleccionado] = useState({
    _id: '',
    Nombre: '',
    Apellido: '',
    Telefono: '',
    Email: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setClienteSeleccionado(prevState => ({
      ...prevState,
      [name]: value
    }));
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
    try {
      console.log("Cliente seleccionado antes de enviar:", clienteSeleccionado); 
  
      const response = await axios.post(baseUrl, clienteSeleccionado, {
        headers: { 'Content-Type': 'application/json' }
      });
  
      console.log("Respuesta de la API:", response.data);
  
      if (response.data) {
        setData([...data, response.data]);
        abrirCerrarModalInsertar();
        toast.success('Cliente agregado correctamente!');
      } else {
        toast.error('Error: No se recibió el cliente en la respuesta de la API.');
      }
    } catch (error) {
      console.error("Error al agregar el Cliente:", error);
      toast.error('Error al agregar el Cliente.');
    }
  };

  const peticionPut = async () => {
    try {
      await axios.put(`${baseUrl}/${clienteSeleccionado._id}`, clienteSeleccionado, {
        headers: { 'Content-Type': 'application/json' }
      });

      const dataNueva = data.map(cliente =>
        clienteSeleccionado._id === cliente._id ? clienteSeleccionado : cliente
      );
      setData(dataNueva);
      abrirCerrarModalEditar();
      toast.success('Cliente editado correctamente!');
    } catch (error) {
      console.error("Error al editar el Cliente:", error);
      toast.error('Error al editar el Cliente.');
    }
  };

  const peticionDelete = async () => {
    try {
      await axios.delete(`${baseUrl}/${clienteSeleccionado._id}`);
      setData(data.filter(cliente => cliente._id !== clienteSeleccionado._id));
      abrirCerrarModalEliminar();
      toast.success('Cliente eliminado correctamente!');
    } catch (error) {
      console.error("Error al eliminar el Cliente:", error);
      toast.error('Error al eliminar el Cliente.');
    }
  };

  const abrirCerrarModalInsertar = () => setModalInsertar(!modalInsertar);
  const abrirCerrarModalEditar = () => setModalEditar(!modalEditar);
  const abrirCerrarModalEliminar = () => setModalEliminar(!modalEliminar);

  const seleccionarCliente = (cliente, caso) => {
    setClienteSeleccionado(cliente);
    caso === 'Editar' ? abrirCerrarModalEditar() : abrirCerrarModalEliminar();
  };

  useEffect(() => {
    peticionGet();
  }, []);

  const filteredData = data.filter(cliente => 
    (cliente._id && cliente._id.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (cliente.Nombre && cliente.Nombre.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (cliente.Apellido && cliente.Apellido.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (cliente.Telefono && cliente.Telefono.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (cliente.Email && cliente.Email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const displayedData = filteredData.slice(0, recordsToShow);

  const bodyInsertar = (
    <div className={`contenedorAgregar ${theme}`}>
      <h1>Agregar Nuevo Cliente</h1>
      <div className={`todo ${theme}`}>
        <TextField sx={{mr:2, mt:2}} name="_id" className="opcion" label="_id" onChange={handleChange} />
        <br />
        <TextField sx={{mr:2, mt:2}} name="Nombre" className="opcion" label="Nombre" onChange={handleChange} />
        <br />
        <TextField sx={{mr:2, mt:2}} name="Apellido" className="opcion" label="Apellido" onChange={handleChange} />
        <br />
        <TextField sx={{mr:2, mt:2}} name="Telefono" className="opcion" label="Telefono" onChange={handleChange} />
        <br />
        <TextField sx={{mr:2, mt:2}} name="Email" className="opcion" label="Email" onChange={handleChange} />
        <br /><br />
      </div>
      <div align="right">
        <Button color="primary" onClick={peticionPost}>Insertar</Button>
        <Button onClick={abrirCerrarModalInsertar}>Cancelar</Button>
      </div>
    </div>
  );

  const bodyEditar = (
    <div className='contenedorEditar'>
      <h1>Editar Cliente</h1>
      <div className={`todo ${theme}`}>
        <TextField sx={{mr:2, mt:2}} name="Nombre" className="opcion" label="Nombre" onChange={handleChange} value={clienteSeleccionado.Nombre} />
        <br />
        <TextField sx={{mr:2, mt:2}} name="Apellido" className="opcion" label="Apellido" onChange={handleChange} value={clienteSeleccionado.Apellido} />
        <br />
        <TextField sx={{mr:2, mt:2}} name="Telefono" className="opcion" label="Telefono" onChange={handleChange} value={clienteSeleccionado.Telefono} />
        <br />
        <TextField sx={{mr:2, mt:2}} name="Email" className="opcion" label="Email" onChange={handleChange} value={clienteSeleccionado.Email} />
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
      <h3>Estás seguro que deseas eliminar el Cliente? -- <code><b>{clienteSeleccionado.Nombre}</b></code>? </h3>
      <div align="right">
        <Button color="secondary" onClick={peticionDelete}>Sí</Button>
        <Button onClick={abrirCerrarModalEliminar}>No</Button>
      </div>
    </div>
  );

  return (
    <div className="App">
      <br />
      <center>
      <Typography variant="h3">Clientes Registrados</Typography>
      <br />
      <Typography variant="h6">Total de Clientes registrados: {filteredData.length}</Typography>
      </center>
      <br />
      <center>
      <Button variant="contained" sx={{
        color: "white", 
        backgroundColor: "blue", 
        borderRadius: 10, 
        '&:hover': {
          color: "black", 
          backgroundColor: "red"
        }
      }} onClick={abrirCerrarModalInsertar}>+ Agregar Cliente</Button>
      </center>
      <br />
      <center>
      <TextField 
        sx={{
          mb:5,
          backgroundColor: theme === 'light' ? 'transparent' : '#333',
          color: theme === 'light' ? 'black' : 'white',
          label: {
            color: theme === 'light' ? 'black' : 'white',
            fontWeight: theme === 'light' ? 'bold' : 'normal',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: theme === 'light' ? 'black' : 'white',
            },
            '&:hover fieldset': {
              borderColor: theme === 'light' ? 'gray' : 'lightgray',
            },
         },
         '& .MuiInputBase-input': {
          color: theme === 'light' ? 'black' : 'white',
        },
        }}
        label="Buscar Cliente"
        variant="outlined"
        onChange={handleSearch}/>
      <br />
      <FormControl sx={{
          mb:5,
          backgroundColor: theme === 'light' ? 'transparent' : '#333',
          color: theme === 'light' ? 'black' : 'white',
          label: {
            color: theme === 'light' ? 'black' : 'white',
            fontWeight: theme === 'light' ? 'bold' : 'normal',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: theme === 'light' ? 'black' : 'white',
            },
            '&:hover fieldset': {
              borderColor: theme === 'light' ? 'gray' : 'lightgray',
            },
         },
         '& .MuiInputBase-input': {
          color: theme === 'light' ? 'black' : 'white',
        },
        }} className={styles.select}>
        <InputLabel>Registros por Página</InputLabel>
        <Select sx={{mt:2, width: 150}} value={recordsToShow} onChange={handleRecordsChange}>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={50}>50</MenuItem>
        </Select>
      </FormControl>
      </center>
      <br />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{color: ({ isActive }) => isActive ? (theme === 'light' ? 'black' : 'white') : (theme === 'light' ? 'black' : 'white')}}>ID</TableCell>
              <TableCell sx={{color: ({ isActive }) => isActive ? (theme === 'light' ? 'black' : 'white') : (theme === 'light' ? 'black' : 'white')}}>Nombre</TableCell>
              <TableCell sx={{color: ({ isActive }) => isActive ? (theme === 'light' ? 'black' : 'white') : (theme === 'light' ? 'black' : 'white')}}>Apellido</TableCell>
              <TableCell sx={{color: ({ isActive }) => isActive ? (theme === 'light' ? 'black' : 'white') : (theme === 'light' ? 'black' : 'white')}}>Telefono</TableCell>
              <TableCell sx={{color: ({ isActive }) => isActive ? (theme === 'light' ? 'black' : 'white') : (theme === 'light' ? 'black' : 'white')}}>Email</TableCell>
              <TableCell sx={{color: ({ isActive }) => isActive ? (theme === 'light' ? 'black' : 'white') : (theme === 'light' ? 'black' : 'white')}}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedData.map((cliente) => (
              <TableRow key={cliente._id}>
                <TableCell sx={{color: ({ isActive }) => isActive ? (theme === 'light' ? 'black' : 'white') : (theme === 'light' ? 'black' : 'white')}}>{cliente._id}</TableCell>
                <TableCell sx={{color: ({ isActive }) => isActive ? (theme === 'light' ? 'black' : 'white') : (theme === 'light' ? 'black' : 'white')}}>{cliente.Nombre}</TableCell>
                <TableCell sx={{color: ({ isActive }) => isActive ? (theme === 'light' ? 'black' : 'white') : (theme === 'light' ? 'black' : 'white')}}>{cliente.Apellido}</TableCell>
                <TableCell sx={{color: ({ isActive }) => isActive ? (theme === 'light' ? 'black' : 'white') : (theme === 'light' ? 'black' : 'white')}}>{cliente.Telefono}</TableCell>
                <TableCell sx={{color: ({ isActive }) => isActive ? (theme === 'light' ? 'black' : 'white') : (theme === 'light' ? 'black' : 'white')}}>{cliente.Email}</TableCell>
                <TableCell>
                  <Edit sx={{color: ({ isActive }) => isActive ? (theme === 'light' ? 'black' : 'white') : (theme === 'light' ? 'black' : 'white')}} className="iconos" onClick={() => seleccionarCliente(cliente, 'Editar')} />
                  &nbsp;&nbsp;&nbsp;
                  <Delete sx={{color: ({ isActive }) => isActive ? (theme === 'light' ? 'black' : 'white') : (theme === 'light' ? 'black' : 'white')}} className="iconos" onClick={() => seleccionarCliente(cliente, 'Eliminar')} />
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

export default Clientes;

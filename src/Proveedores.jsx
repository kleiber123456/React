import { Modal, Table, TableContainer, MenuItem, TableHead, TableRow, TableCell, TableBody, Select, TextField, InputLabel, Button, Typography, FormControl } from "@mui/material"
import { Edit, Delete } from '@mui/icons-material';
import { useState, useEffect } from "react";
import axios from "axios";
import {toast } from 'react-toastify';
import { TablePagination } from '@mui/material';



const baseUrl = 'http://localhost:3000/api/Proveedores';



export default function Proveedores({theme}){
    const[searchTerm, setSearchTerm]=useState("")
    const [data, setData] = useState([]);
    const[recordToShow, setRecordToShow] = useState(10)
    const[modalEditar, setModalEditar]=useState(false)
    const[modalEliminar, setModalEliminar]=useState(false)
    const[modalInsertar, setModalInsertar]=useState(false)
    const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(recordToShow);
    const [proveedorSeleccionado, setProveedorSeleccionado]= useState({
        _id:'',
        Nombre:'',
        Apellido:'',
        Email:'',
        Telefono:'',
        Direccion:'',
    })
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0); // Resetea a la primera página
    };
    const Cambio = e => {
        const { name, value } = e.target;
        setProveedorSeleccionado(prevState => ({
          ...prevState,
          [name]: value
        }));
      };
    
      const handleSearch = (e) => setSearchTerm(e.target.value);
      const handleRecordsChange = (e) => setRecordToShow(parseInt(e.target.value, 10));

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
          console.log("proveedor seleccionado antes de enviar:", proveedorSeleccionado);
      
          const response = await axios.post(baseUrl, proveedorSeleccionado, {
            headers: { 'Content-Type': 'application/json' }
          });
      
          console.log("Respuesta de la API:", response.data);
      
          if (response.data) {
            setData([...data, response.data]);
            AbrirInsertar();
            toast.success('proveedor agregado correctamente!');
          } else {
            toast.error('Error: No se recibió el proveedor en la respuesta de la API.');
          }
        } catch (error) {AbrirInsertar
          console.error("Error al agregar el proveedor:", error);
          toast.error('Error al agregar el proveedor.');
        }
      };
    
      const peticionPut = async () => {
        try {
          await axios.put(`${baseUrl}/${proveedorSeleccionado._id}`, proveedorSeleccionado, {
            headers: { 'Content-Type': 'application/json' }
          });
    
          const dataNueva = data.map(proveedor =>
            proveedorSeleccionado._id === proveedor._id ? proveedorSeleccionado : proveedor
          );
          setData(dataNueva);
          AbrirEditar();
          toast.success('proveedor editado correctamente!');
        } catch (error) {
          console.error("Error al editar el proveedor:", error);
          toast.error('Error al editar el proveedor.');
        }
      };

    const peticionDelete = async () => {
        try {
          await axios.delete(`${baseUrl}/${proveedorSeleccionado._id}`);
          setData(data.filter(proveedor => proveedor._id !== proveedorSeleccionado._id));
          AbrirEliminar();
          toast.success('proveedor eliminado correctamente!');
        } catch (error) {
          console.error("Error al eliminar el proveedor:", error);
          toast.error('Error al eliminar el proveedor.');
        }
      };

    const AbrirEditar = () => setModalEditar(!modalEditar);
    const AbrirEliminar = () => setModalEliminar(!modalEliminar);
    const AbrirInsertar = () => setModalInsertar(!modalInsertar);

    const seleccionarProveedor = (proveedor, caso) =>{
        setProveedorSeleccionado(proveedor);
        caso === 'Editar'?AbrirEditar() : AbrirEliminar()
    }


    useEffect(() => {
        peticionGet();
      }, []);

    const filteredData = data.filter(proveedor => 
      (proveedor._id && proveedor._id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (proveedor.Nombre && proveedor.Nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (proveedor.Apellido && proveedor.Apellido.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (proveedor.Email && proveedor.Email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (proveedor.Telefono && proveedor.Telefono.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (proveedor.Direccion && proveedor.Direccion.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const Proveedores = filteredData.slice(0, recordToShow);

    const insertarProveedor =(
        <div className={`contenedorAgregar ${theme}`}>
            <h1>Insertar Proveedor</h1>
            <br />
            <div className={`todo ${theme}`}>
              <TextField sx={{mr:2, mt:2}} className="_id" name="_id" label="id"  onChange={Cambio}/>
              <br />
              <TextField sx={{mr:2, mt:2}} type="text" className="Nombre" name="Nombre" label="Nombre"  onChange={Cambio}/>
              <br />
              <TextField sx={{mr:2, mt:2}} type="text" className="Apellido" name="Apellido" label="Apellido"  onChange={Cambio}/>
              <br />
              <TextField sx={{mr:2, mt:2}} type="email" className="Email" name="Email" label="Email"  onChange={Cambio}/>
              <br />
              <TextField sx={{mr:2, mt:2}} type="text" className="Telefono" name="Telefono" label="Telefono"  onChange={Cambio}/>
              <br />
              <TextField sx={{mr:2, mt:2}} className="opcion" name="Direccion" label="Direccion"  onChange={Cambio}/>
              <br />
            </div>
            <div align="right">
                <Button color="primary" onClick={peticionPost}>Insertar</Button>
                <Button onClick={AbrirInsertar}>Cancelar</Button>
            </div>
        </div>
    )

    const editarProveedor =(
        <div className='contenedorEditar'>
            <h1>Editar Proveedor</h1>
            <div className={`todo ${theme}`}>
              <TextField sx={{mr:2, mt:2}} className="opcion" name="_id" label="_id"  onChange={Cambio} value={proveedorSeleccionado._id}/>
              <br />
              <TextField sx={{mr:2, mt:2}} className="opcion" name="Nombre" label="Nombre"  onChange={Cambio} value={proveedorSeleccionado.Nombre}/>
              <br />
              <TextField sx={{mr:2, mt:2}} className="opcion" name="Apellido" label="Apellido"  onChange={Cambio} value={proveedorSeleccionado.Apellido}/>
              <br />
              <TextField sx={{mr:2, mt:2}} className="opcion" name="Email" label="Email"  onChange={Cambio} value={proveedorSeleccionado.Email}/>
              <br />
              <TextField sx={{mr:2, mt:2}} className="opcion" name="Telefono" label="Telefono"  onChange={Cambio} value={proveedorSeleccionado.Telefono}/>
              <br />
              <TextField type="date" sx={{mr:2, mt:2}} className="opcion" name="Direccion" label="Direccion"  onChange={Cambio} value={proveedorSeleccionado.Direccion}/>
              <br />
            </div>
            <div>
              <Button color="primary" onClick={peticionPut}>Editar</Button>
              <Button onClick={AbrirEditar}>Cancelar</Button>
            </div>
        </div>
    )

    const eliminarProveedor =(
        <div className='contenedorEliminar'>
            <h3>Estás seguro que deseas eliminar el Proveedor? -- <code><b>{proveedorSeleccionado.Nombre}</b></code>? </h3>
            <div align="right">
                <Button color="secondary" onClick={peticionDelete}>Sí</Button>
                <Button onClick={AbrirEliminar}>No</Button>
            </div>
        </div>
    )

    return(
        <div className="App">
            <br />
            <center>
            <Typography variant="h3">Proveedores Registrados</Typography>
            <br />
            <Typography variant="h6">Total de Proveedores registrados: {filteredData.length}</Typography>
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
            }} onClick={AbrirInsertar}>+ Agregar Proveedor</Button>
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
                }}>
                <InputLabel>Registros por Página</InputLabel>
                <Select sx={{mt:2, width: 100}} value={recordToShow} onChange={handleRecordsChange}>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                </Select>
            </FormControl>
            </center>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{color: ({ isActive }) => isActive ? (theme === 'light' ? 'black' : 'white') : (theme === 'light' ? 'black' : 'white')}}>ID Proveedor</TableCell>
                            <TableCell sx={{color: ({ isActive }) => isActive ? (theme === 'light' ? 'black' : 'white') : (theme === 'light' ? 'black' : 'white')}}>Nombre</TableCell>
                            <TableCell sx={{color: ({ isActive }) => isActive ? (theme === 'light' ? 'black' : 'white') : (theme === 'light' ? 'black' : 'white')}}>Apellido</TableCell>
                            <TableCell sx={{color: ({ isActive }) => isActive ? (theme === 'light' ? 'black' : 'white') : (theme === 'light' ? 'black' : 'white')}}>Email</TableCell>
                            <TableCell sx={{color: ({ isActive }) => isActive ? (theme === 'light' ? 'black' : 'white') : (theme === 'light' ? 'black' : 'white')}}>Teléfono</TableCell>
                            <TableCell sx={{color: ({ isActive }) => isActive ? (theme === 'light' ? 'black' : 'white') : (theme === 'light' ? 'black' : 'white')}}>Direccion</TableCell>
                            <TableCell sx={{color: ({ isActive }) => isActive ? (theme === 'light' ? 'black' : 'white') : (theme === 'light' ? 'black' : 'white')}}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Proveedores.map((proveedor)=>(
                            <TableRow key={proveedor._id}>
                                <TableCell sx={{color: ({ isActive }) => isActive ? (theme === 'light' ? 'black' : 'white') : (theme === 'light' ? 'black' : 'white')}}>{proveedor._id}</TableCell>
                                <TableCell sx={{color: ({ isActive }) => isActive ? (theme === 'light' ? 'black' : 'white') : (theme === 'light' ? 'black' : 'white')}}>{proveedor.Nombre}</TableCell>
                                <TableCell sx={{color: ({ isActive }) => isActive ? (theme === 'light' ? 'black' : 'white') : (theme === 'light' ? 'black' : 'white')}}>{proveedor.Apellido}</TableCell>
                                <TableCell sx={{color: ({ isActive }) => isActive ? (theme === 'light' ? 'black' : 'white') : (theme === 'light' ? 'black' : 'white')}}>{proveedor.Email}</TableCell>
                                <TableCell sx={{color: ({ isActive }) => isActive ? (theme === 'light' ? 'black' : 'white') : (theme === 'light' ? 'black' : 'white')}}>{proveedor.Telefono}</TableCell>
                                <TableCell sx={{color: ({ isActive }) => isActive ? (theme === 'light' ? 'black' : 'white') : (theme === 'light' ? 'black' : 'white')}}>{proveedor.Direccion}</TableCell>
                                <TableCell>
                                    <Edit sx={{color: ({ isActive }) => isActive ? (theme === 'light' ? 'black' : 'white') : (theme === 'light' ? 'black' : 'white')}} className="iconos" onClick={() => seleccionarProveedor(proveedor, 'Editar')} />
                                    &nbsp;&nbsp;&nbsp;
                                    <Delete sx={{color: ({ isActive }) => isActive ? (theme === 'light' ? 'black' : 'white') : (theme === 'light' ? 'black' : 'white')}} className="iconos" onClick={() => seleccionarProveedor(proveedor, 'Eliminar')} />
                                    </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
          rowsPerPageOptions={[5, 10, 25]} sx={{color:"White"}} // Opciones de registros por página
          component="div"
          count={filteredData.length} // Total de registros
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

            <Modal open={modalInsertar} onClose={AbrirInsertar}>
                {insertarProveedor}
            </Modal>

            <Modal open={modalEditar} onClose={AbrirEditar}>
                {editarProveedor}
            </Modal>

            <Modal open={modalEliminar} onClose={AbrirEliminar}>
                {eliminarProveedor}
            </Modal>
        </div>
    )
}
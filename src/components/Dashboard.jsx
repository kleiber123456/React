import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import { getData, postData } from '../api/api'; // Asegúrate de importar correctamente las funciones

const Dashboard = () => {
  const [clientes, setClientes] = useState(0);
  const [proveedores, setProveedores] = useState(0);
  const [productos, setProductos] = useState(0);
  const [stockTotal, setStockTotal] = useState(0);
  const [ventasTotal, setVentasTotal] = useState(0); // Cambiado a ventasTotal para mostrar la suma de totales

  useEffect(() => {
    // Cargar clientes, proveedores, productos/servicios
    getData('clientes').then(data => setClientes(data.length));
    getData('proveedores').then(data => setProveedores(data.length));
    getData('productoservicio').then(data => setProductos(data.length));

    // Cargar ventas y calcular totales
    getData('ventas').then(data => {
      // Sumar los totales de las ventas
      const totalVentas = data.reduce((acc, venta) => acc + venta.Total, 0);
      setVentasTotal(totalVentas); // Mostrar la suma de los totales en el Dashboard
      console.log('Suma Total de Ventas:', totalVentas);  // Imprime la suma total de las ventas

      // Calcular el stock total a partir de las compras y restar el total de las ventas
      getData('compras').then(compras => {
        const totalStockCompras = compras.reduce((acc, compra) => acc + compra.Stock, 0);
        const stockActual = totalStockCompras - totalVentas; // Restar el total de las ventas del stock de compras
        setStockTotal(stockActual);
      });
    });
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ color:"white",backgroundImage: "url('https://img.freepik.com/foto-gratis/ilustracion-cyberpunk-colores-neon-tecnologia-futurista_23-2151672015.jpg?size=626&ext=jpg&ga=GA1.1.2008272138.1724457600&semt=ais_hybrid')" }}>
            <CardContent>
              <Typography sx={{fontWeight:900}} variant="h6">Clientes</Typography>
              <Typography sx={{fontWeight:900}} variant="h3">{clientes}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{color:"white", backgroundImage: "url('https://media.istockphoto.com/id/1652511983/es/vector/gesti%C3%B3n-de-la-cadena-de-suministro-scm-ilustraci%C3%B3n-conceptual.jpg?s=612x612&w=0&k=20&c=kfSVewYYvec6r2s19OCX6sDQ4LGNzPjVtUUCpza2hBc=')"}}>
            <CardContent>
              <Typography sx={{fontWeight:900}} variant="h6">Proveedores</Typography>
              <Typography sx={{fontWeight:900}} variant="h3">{proveedores}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{color:"white", backgroundImage: "url('https://img.freepik.com/foto-gratis/conexion-red-internet-negocios-global-iot-internet-cosas-bus-concepto-inteligencia-negocios_1258-177091.jpg?t=st=1723054131~exp=1723057731~hmac=40f500fecacc7fbc4bb3c3112edbf674dc34e2990a6fd3eae688e91770d4b9c9')"}}>
            <CardContent>
              <Typography sx={{fontWeight:900}} variant="h6">Unidades en Stock (Compras)</Typography>
              <Typography sx={{fontWeight:900}} variant="h3">{stockTotal}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{color:"white", backgroundImage: "url('https://img.freepik.com/fotos-premium/guia-completa-carteras-inversion-diversificadas_264138-1794.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1723334400&semt=ais_hybrid')"}}>
            <CardContent>
              <Typography sx={{fontWeight:900}} variant="h6">Ventas</Typography>
              <Typography sx={{fontWeight:900}} variant="h3">{ventasTotal}</Typography> {/* Mostrar la suma total de los productos vendidos */}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

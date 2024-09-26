import { Typography, Card, Grid, Container, CardMedia, CardContent } from '@mui/material';
import { useProducts } from './useProducts';

export default function Home({ theme }) {
  const products = useProducts();

  return (
    <div>
      <img
        src="/imagenes/construye.jpg"
        id="construye"
        className={`construye ${theme}`} 
        alt="Construye"
      />
      <Container>
        <Typography variant="h3" gutterBottom>
          Productos Disponibles
        </Typography>
        <Grid container spacing={4}>
          {products.length === 0 ? (
            <Typography>No hay productos disponibles.</Typography>
          ) : (
            products.map(producto => (
              <Grid item xs={12} sm={6} md={4} key={producto._id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={producto.Imagen || "/path-to-default-image.jpg"}
                    alt={producto.Nombre}
                  />
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {producto.Nombre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {producto.Descripcion}
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      Precio: ${producto.Precio}
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      Tipo: {producto.Tipo}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </div>
  );
}

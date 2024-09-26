import React, { useState } from 'react';
import { Drawer, IconButton, Toolbar, Typography, Box, ListItem, ListItemText } from "@mui/material";
import { Link } from 'react-router-dom';
import { NavLink } from "react-router-dom";
import './Navbar.css';
import NavListDrawer from "./NavListDrawer";
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = ({ theme, setTheme, navegationLinks = [] }) => { 
  const [open, setOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`navbar ${theme}`}>
      <Toolbar>
        <IconButton
          color="inherit"
          size="large"
          onClick={() => setOpen(true)}
          edge="start"
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1 }}
        >
        </Typography>
      </Toolbar>

      <Drawer
        open={open}
        anchor="left"
        onClose={() => setOpen(false)}
      >
        <NavListDrawer
          navegationLinks={navegationLinks}
          component={NavLink}
          setOpen={setOpen}
          theme={theme}
        />
      </Drawer>
      
      <Link to="/">
        <img
          src={theme === 'light' ? "/imagenes/logo-gym2.PNG" : "/imagenes/logo-gym.PNG"}
          alt="logo"
          className='logo'
        />
      </Link>      
      <Box sx={{
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center',
        listStyle: 'none',
        padding: 0,
        margin: 0,
        flex: 1
      }}>
        {navegationLinks.map((item) => (
          <ListItem
            key={item.title}
            disablePadding
            sx={{ml:4}}
          >
            <NavLink 
              to={item.path}
              style={({ isActive }) => ({
                textDecoration: 'none',
                color: isActive ? (theme === 'light' ? 'blue' : 'blue') : (theme === 'light' ? 'black' : 'white')
              })}
            >
              <ListItemText primary={item.title} />
            </NavLink>
          </ListItem>
        ))}
      </Box>

      <div className={`box ${theme}`}>
        <input className={`buscador ${theme}`} type="text" placeholder="Buscar "/>
        <SearchIcon style={{ color: "white" }}/>
      </div>

      {theme === 'light' ? (
        <DarkModeIcon onClick={toggleTheme} style={{ width: 50, cursor: "pointer", marginLeft: 5 }}/>
      ) : (
        <WbSunnyIcon onClick={toggleTheme} style={{ width: 50, cursor: "pointer", marginLeft: 5 }}/>
      )}
    </div>
  );
};

export default Navbar;

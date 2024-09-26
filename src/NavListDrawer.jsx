import React from 'react';
import { Box } from "@mui/system";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

const NavListDrawer = ({ navegationLinks = [], component, setOpen, theme }) => {
  return (
    <Box sx={{ width: 250, height: 1000, borderRight: 2, borderColor: "blue" }} className={`cajonnav ${theme}`}>
      <nav>
        <List>
          {navegationLinks.map((item) => (
            <ListItem
              disablePadding
              key={item.title}
            >
              <ListItemButton
                component={component}
                to={item.path}
                onClick={() => setOpen(false)}
                className={theme}
              >
                <ListItemIcon
                  sx={{
                    color: ({ isActive }) => isActive ? (theme === 'light' ? 'black' : 'white') : (theme === 'light' ? 'black' : 'white')
                  }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </nav>
    </Box>
  );
};

export default NavListDrawer;

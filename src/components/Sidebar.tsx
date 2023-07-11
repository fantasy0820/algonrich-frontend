import { useState, useEffect } from 'react';
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import axios from 'axios';

interface SidebarProps {
  onCategoryChange: (catId: number) => void;
}

export const Sidebar = ({ onCategoryChange }: SidebarProps) => {
  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/category/get_active_categories`,
    );

    setCategories(response.data);
  };

  const handleCategoryClick = (catId: number) => {
    onCategoryChange(catId);
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div>
      <List>
        <p className="py-2 pl-6 text-lg font-bold">All Categories</p>
        {categories.map((element: any) => (
          <ListItem key={element.id} disablePadding className="pl-2">
            <ListItemButton onClick={() => handleCategoryClick(element.id)}>
              <ListItemText primary={element.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

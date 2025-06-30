import React from 'react';
import './index.css';
import { NavLink } from 'react-router-dom';

/**
 * The SideBarNav component has three menu items: "Questions", "Tags", and "Messaging".
 * It highlights the currently selected item based on the active page and
 * triggers corresponding functions when the menu items are clicked.
 */
const SideBarNav = () => (
  <div id='sideBarNav' className='sideBarNav'>
    <NavLink
      to='/home'
      id='menu_questions'
      className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
      Questions
    </NavLink>
    <NavLink
      to='/tags'
      id='menu_tag'
      className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
      Tags
    </NavLink>
    <NavLink
      to='/messaging'
      id='menu_messaging'
      className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
      Messaging
    </NavLink>
  </div>
);

export default SideBarNav;

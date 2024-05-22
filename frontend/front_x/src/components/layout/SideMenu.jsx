import React ,{useState} from 'react'
import { Link, useLocation } from 'react-router-dom'

const SideMenu = ({menuItems}) => {

    
    const location = useLocation();

    const [activeMenuItem, setactiveMenuItem] = useState(location.pathname);
    
    const handleMenuClick = (menuItemUrl) => {
        setactiveMenuItem(menuItemUrl)

    }

    return (
        <div className="list-group mt-5 pl-4">
          {menuItems?.map((menuItem, index) => (
            <Link
              key={index}
              to={menuItem.url}
              className={`fw-bold list-group-item list-group-item-action ${activeMenuItem === menuItem.url ? "active" : ""}`}
              onClick = {() => handleMenuClick(menuItem.url)} 
              aria-current = {activeMenuItem === menuItem.url ? "true" : "false"}
            >
              <i className={`${menuItem.icon} fa-fw pe-2`}></i> {menuItem.name}
            </Link>
          ))}
        </div>
      )
}

export default SideMenu

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUser, faHamburger, faShoppingBag, faReceipt } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { MenuContainer } from "./NavbarFooterStyles";
import { useStore } from '../../contexts/StoreContext';

interface MenuProps {
  active?: "home" | "orders" | "cart";
}

export default function NavbarFlex({ active }: MenuProps) {
  const { store } = useStore();

  return (
    <MenuContainer style={{ backgroundColor: store?.primaryColor}}>
      <Link to="/">
        <div className={active === "home" ? "active" : ""}>
          <FontAwesomeIcon icon={faHome} fontSize={20} />
          <p>Início</p>
        </div>
      </Link>
      <Link to="/cart">
        <div className={active === "cart" ? "active" : ""}>
          <FontAwesomeIcon icon={faShoppingBag} fontSize={20} />
          <p>Carrinho</p>
        </div>
      </Link>
      <Link to="/orders">
        <div className={active === "orders" ? "active" : ""}>
          <FontAwesomeIcon icon={faReceipt} fontSize={20} />
          <p>Pedidos</p>
        </div>
      </Link>
    </MenuContainer>
  );
}

import "bootstrap/dist/css/bootstrap.min.css";
import {
    Navbar,
    NavbarBrand,
} from "reactstrap";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function NavBar() {

    return (
        <Navbar
            dark
            expand="md"
            fixed=""
            light>
            <Link to={'/'}>
                <NavbarBrand>
                    <img src={require("../img/logo_exp.png")} alt="Luniko"></img>
                </NavbarBrand>
            </Link>
        </Navbar >
    );
}

export default NavBar;

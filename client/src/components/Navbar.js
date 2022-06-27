import "bootstrap/dist/css/bootstrap.min.css";
import {
    Navbar,
    NavbarBrand,
} from "reactstrap";
import "../styles/Navbar.css";

function NavBar() {

    return (
        <Navbar
            dark
            expand="md"
            fixed=""
            light>
            <NavbarBrand href="/">
                <img src={require("../img/logo_exp.png")} alt="Luniko"></img>
            </NavbarBrand>
        </Navbar >
    );
}

export default NavBar;

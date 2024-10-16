/* Imports */
import React from "react";
import "./styles.css";
import { Text } from "../../components/text/Text";
import { Home, Search, User } from "lucide-react";
import { Link } from "react-router-dom";

/* Interfaces */
interface Props {}
interface State {}

export class Navbar extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <nav className="navbar-top">
                <Text.H3 text="Twitter2" style={{ userSelect: "none" }} />
                <div className="nav-links">
                    <Link to="/"><Home color="#fff" strokeWidth={3} /></Link>
                    <Link to="/"><Search color="#fff" strokeWidth={3} /></Link>
                    <Link to="/"><User color="#fff" strokeWidth={3} /></Link>
                </div>
            </nav>
        );
    }
}

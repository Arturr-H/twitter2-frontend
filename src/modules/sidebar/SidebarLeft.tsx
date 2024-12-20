/* Imports */
import React from "react";
import "./styles.css";
import { NavButton } from "../../components/button/NavButton";
import { Bookmark, Home, PenBox, Search, Settings, User } from "lucide-react";
import toast from "react-hot-toast";

/* Interfaces */
interface Props {
    compose: (reply_to: number | null) => void
}
interface State {}

export class SidebarLeft extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <nav className="sidebar sidebar-left">
                <div className="sidebar-inner">
                    <NavButton icon={<Home size={"1rem"} />} text="Home" to="/" />
                    <NavButton icon={<Search size={"1rem"} />} text="Search" to="/search" />
                    <NavButton icon={<User size={"1rem"} />} text="Profile" to="/profile" />
                    <NavButton icon={<Bookmark size={"1rem"} />} text="Saved" to="/bookmarks" />

                    <div style={{ flex: 1 }} />

                    <NavButton icon={<Settings size={"1rem"} />} text="Options" onClickSync={() => toast("No")} />
                    <NavButton primary icon={<PenBox size={"1rem"} />} text="Compose" onClickSync={() => this.props.compose(null)} />
                </div>
            </nav>
        );
    }
}

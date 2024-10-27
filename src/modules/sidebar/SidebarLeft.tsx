/* Imports */
import React from "react";
import "./styles.css";
import { NavButton } from "../../components/button/NavButton";
import { Bookmark, Compass, Home, PenBox, Search, Settings, User } from "lucide-react";

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
                    <NavButton icon={<Home size={20} />} text="Home" to="/" />
                    <NavButton icon={<Search size={20} />} text="Search" to="/search" />
                    <NavButton icon={<Compass size={20} />} text="Discover" />
                    <NavButton icon={<User size={20} />} text="Profile" to="/profile" />
                    <NavButton icon={<Bookmark size={20} />} text="Saved" to="/bookmarks" />

                    <div style={{ flex: 1 }} />

                    <NavButton icon={<Settings size={20} />} text="Options" />
                    <NavButton primary icon={<PenBox size={20} />} text="Compose" onClickSync={() => this.props.compose(null)} />
                </div>
            </nav>
        );
    }
}

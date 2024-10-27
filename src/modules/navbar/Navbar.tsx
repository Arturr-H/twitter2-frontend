/* Imports */
import React from "react";
import "./styles.css";
import { Text } from "../../components/text/Text";
import { Home, Search, User } from "lucide-react";
import { Link } from "react-router-dom";
import { UserInfo } from "../tweet/TweetTypes";
import { Backend } from "../../handlers/Backend";

/* Interfaces */
interface Props {}
interface State {
    user_info: UserInfo | null
}

export class Navbar extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            user_info: null
        }
    }

    componentDidMount(): void {
        Backend.get_auth<UserInfo>("/user/profile").then(e => {
            if (e.ok) {
                this.setState({ user_info: e.value });
            }else {
                console.error(e.error.description);
            }
        });
    }

    render(): React.ReactNode {
        return (
            <nav className="navbar-top">
                <Text.H3 text="Twitter2" style={{ userSelect: "none" }} />
                <div className="nav-links">
                    <Link to="/"><Home color="#fff" strokeWidth={3} /></Link>
                    <Link to="/search"><Search color="#fff" strokeWidth={3} /></Link>
                    <Link to="/profile">
                        <img
                            className="profile-image"
                            src={Backend.profileImage(this.state.user_info?.user_id)}
                        />
                    </Link>
                </div>
            </nav>
        );
    }
}

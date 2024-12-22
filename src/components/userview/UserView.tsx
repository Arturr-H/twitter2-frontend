/* Imports */
import React from "react";
import "./styles.css";
import { UserInfo } from "../../modules/tweet/TweetTypes";
import { Backend } from "../../handlers/Backend";
import { Text } from "../text/Text";
import { Link } from "react-router-dom";

/* Interfaces */
interface State {}

export class UserView extends React.PureComponent<UserInfo, State> {
    constructor(props: UserInfo) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <Link to={"/user/" + this.props.handle} style={{ textDecoration: "none" }}>
                <div className="user-view">
                    <img src={Backend.profileImage(this.props.user_id)} alt="Profile" />

                    <div className="user-info">
                        <div className="upper">
                            {this.props.displayname && this.props.handle ? <>
                                <Text.P className="displayname" text={this.props.displayname} />
                                <Text.P className="handle" text={"~" + this.props.handle} />
                            </> : <></>}
                        </div>
                        <div className="lower">
                            <Text.P style={{ transform: "translateX(-0.05rem)" }} className="handle" text={"Coming soon: profile bios"} />
                        </div>
                    </div>
                </div>
            </Link>
        );
    }
}

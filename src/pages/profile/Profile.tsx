/* Imports */
import React from "react";
import "./styles.css";
import { Navbar } from "../../modules/navbar/Navbar";

/* Interfaces */
interface Props {
    handle: string,
}
interface State {}

export class Profile extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <div className="profile-page">
                <Navbar />

                <div className="profile-container">
                    <div className="profile-image"></div>
                    <div className="name-container">
                        <p className="displayname">Artur Hoffsümmer</p>
                        <p className="handle"><span>@</span>artur</p>
                    </div>
                </div>
            </div>
        );
    }
}

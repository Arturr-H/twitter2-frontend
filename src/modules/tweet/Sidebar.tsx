import React from "react";
import { Backend } from "../../handlers/Backend";

interface Props {
    user_id?: number,
}

export class TweetSidebar extends React.PureComponent<Props> {
    constructor(props: Props) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <div className="sidebar">
                <img
                    className="profile-image"
                    src={Backend.profileImage(this.props.user_id)}
                />
            </div>
        )
    }
}

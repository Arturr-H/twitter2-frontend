import React from "react";
import { Backend } from "../../handlers/Backend";
import { Link } from "react-router-dom";

interface Props {
    user_id?: number,
    handle?: string,
}

export class TweetSidebar extends React.PureComponent<Props> {
    constructor(props: Props) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <div className="sidebar">
                <Link
                    to={`/user/${this.props.handle}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <img
                        className="profile-image"
                        src={Backend.profileImage(this.props.user_id)}
                    />
                </Link>
            </div>
        )
    }
}

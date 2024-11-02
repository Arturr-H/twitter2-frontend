/* Imports */
import React from "react";
import "./styles.css";
import { Feed } from "../../modules/feed/Feed";

/* Interfaces */
interface Props {
    compose: (replies_to: number | null) => void
}
interface State {}

export class Bookmarks extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <div className="container no-padding">
                <Feed title="Bookmarks" feed="/post/bookmarks" compose={this.props.compose} />
            </div>
        );
    }
}

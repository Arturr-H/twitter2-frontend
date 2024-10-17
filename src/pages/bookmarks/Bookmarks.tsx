/* Imports */
import React from "react";
import "./styles.css";
import { Feed } from "../../modules/feed/Feed";

/* Interfaces */
interface Props {}
interface State {}

export class Bookmarks extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <div className="container no-padding">
                <Feed title="Bookmarks" feed="/post/bookmarks" compose={() => {}} />
            </div>
        );
    }
}

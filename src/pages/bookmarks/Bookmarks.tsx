/* Imports */
import React from "react";
import "./styles.css";
import { Feed } from "../../modules/feed/Feed";
import { Modal } from "../../Modal";

/* Interfaces */
interface Props {
    toggleModal: (open: boolean, modal?: Modal) => void,
}
interface State {}

export class Bookmarks extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <div className="container no-padding">
                <Feed title="Bookmarks" feed="/post/bookmarks" toggleModal={this.props.toggleModal} />
            </div>
        );
    }
}

import React from "react";
import { Text } from "../../components/text/Text";
import { Link } from "react-router-dom";

interface Props {
    displayname: string | null,
    handle: string | null,
    user_id: number | null,
}

/** Will desplay skeletal if null props */
export class TweetHeader extends React.PureComponent<Props> {
    render(): React.ReactNode {
        return (
            <div className="header">
                <Link
                    to={this.props.handle
                        ? ("/user/" + this.props.handle) : "#"}
                    onClick={(e) => e.stopPropagation()}
                    className="header-link"
                >
                    {this.props.displayname && this.props.handle ? <>
                        <Text.P className="displayname" text={this.props.displayname} />
                        <Text.P className="handle" text={"~" + this.props.handle} />
                    </>

                    : <>
                        <Text.PSkeletal margined length={12} />
                        <Text.PSkeletal margined length={7} />
                    </>}
                </Link>
            </div>
        )
    }
}
/* Imports */
import React from "react";
import "./styles.css";
import { Feed } from "../../modules/feed/Feed";
import { Tweet } from "../../modules/tweet/Tweet";
import { PlusSquare } from "lucide-react";
import { Button } from "../../components/button/Button";
import { Collapsible } from "../../components/collapsible/Collapsible";

/* Interfaces */
interface Props {
    id: number,
    compose: (post_id: number | null) => void
}
interface State {}

export class Post extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {}
    }

    render(): React.ReactNode {
        return (
            <>
                <Collapsible className="header-tweet-container">
                    <Tweet
                        post_id={this.props.id}
                        compose={() => {}}
                    />
                </Collapsible>

                <div className="post-scene-opinion-container">
                    {/* {this.state.opinions.length === 0
                        ? <Text.P text="No opinions" className="no-opinions-info" />
                        : <Opinions post_id={this.props.id} opinions={this.state.opinions} />}
                     */}
                    <button className="create-opinion">
                        <PlusSquare color="#fff" />
                    </button>
                </div>

                <Feed
                    style={{ display: "flex", flex: 1 }}
                    title="Replies"
                    feed={`/feed/replies/${this.props.id}`}
                    compose={this.props.compose}
                />

                <div style={{ boxSizing: "border-box", padding: "1rem"}}>
                    <Button
                        primary
                        expand
                        onClickSync={() => this.props.compose(this.props.id)}
                        text="Reply" />
                </div>
            </>
        );
    }
}

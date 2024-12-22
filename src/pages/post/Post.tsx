/* Imports */
import React, { RefObject } from "react";
import "./styles.css";
import { Feed } from "../../modules/feed/Feed";
import { Tweet, Tweet_ } from "../../modules/tweet/Tweet";
import { Button } from "../../components/button/Button";
import { Collapsible } from "../../components/collapsible/Collapsible";
import { Modal } from "../../Modal";

/* Interfaces */
interface Props {
    id: number,
    toggleModal: (open: boolean, modal?: Modal) => void,
}
interface State {
    post_id: number
}

export class Post extends React.PureComponent<Props, State> {
    feed: RefObject<Feed> = React.createRef();
    tweet: RefObject<Tweet_> = React.createRef();
    constructor(props: Props) {
        super(props);

        this.state = {
            post_id: this.props.id
        }

        this.setPost = this.setPost.bind(this);
    }

    setPost(post_id: number): void {
        this.feed.current?.setFeed(`/feed/replies/${post_id}`);
        this.setState({ post_id }, () => {
            this.tweet.current?.setPostContent();
        });
    }

    render(): React.ReactNode {
        return (
            <>
                <Collapsible className="header-tweet-container">
                    <Tweet
                        refDrill={this.tweet}
                        post_id={this.state.post_id}
                        toggleModal={this.props.toggleModal}
                        show_reply
                    />
                </Collapsible>

                <Feed
                    style={{ display: "flex", flex: 1 }}
                    title="Replies"
                    feed={`/feed/replies/${this.state.post_id}`}
                    toggleModal={this.props.toggleModal}
                    ref={this.feed}
                />

                <div style={{ boxSizing: "border-box", padding: "1rem"}}>
                    <Button
                        primary
                        expand
                        onClickSync={() => this.props.toggleModal(true, { type: "publish", replies_to: this.state.post_id })}
                        text="Reply" />
                </div>
            </>
        );
    }
}

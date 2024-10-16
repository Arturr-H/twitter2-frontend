/* Imports */
import React from "react";
import "./styles.css";
import { Feed } from "../../modules/feed/Feed";
import { Tweet } from "../../modules/tweet/Tweet";
import { Backend } from "../../handlers/Backend";
import { PostWithUser } from "../../modules/tweet/TweetTypes";
import toast from "react-hot-toast";

/* Interfaces */
interface Props {
    id: number
}
interface State {
    post_with_user: PostWithUser | null
}

export class Post extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            post_with_user: null
        }
    }

    componentDidMount(): void {
        this.fetchPost();
    }

    async fetchPost(): Promise<void> {
        Backend.get_auth<PostWithUser>("/post/id/" + this.props.id).then(e => {
            if (e.ok) {
                this.setState({ post_with_user: e.value });
            }else {
                toast(e.error.description);
            }
        })
    }

    render(): React.ReactNode {
        return (
            <div style={{ overflow: "scroll" }}>
                <div className="header-tweet-container">
                    <Tweet
                        post_with_user={this.state.post_with_user}
                        compose={() => {}}
                    />
                </div>

                <Feed
                    style={{ flex: 1, height: "100%" }}
                    title="Replies"
                    feed="/post/feed"
                    compose={() => {}}
                    
                />
            </div>
        );
    }
}

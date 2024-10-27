/* Imports */
import React from "react";
import "./styles.css";
import { Tweet } from "../tweet/Tweet";
import { Backend } from "../../handlers/Backend";
import { PostWithUser } from "../tweet/TweetTypes";
import { Text } from "../../components/text/Text";
import toast from "react-hot-toast";

/* Interfaces */
interface Props {
    compose: (reply_to: number | null) => void,
    feed: string,
    title?: string,
    style?: React.CSSProperties
}
interface State {
    posts: PostWithUser[]
}

export class Feed extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            posts: []
        }

        this.setFeed = this.setFeed.bind(this);
    }

    componentDidMount(): void {
        this.setFeed(this.props.feed);
    }

    async setFeed(feed: string): Promise<void> {
        try {
            this.setState({ posts: await this.getFeed(feed) })
        }catch (e) {
            toast(`${e}`);
        }
    }
    async getFeed(feed: string): Promise<PostWithUser[]> {
        return Backend.get_auth<PostWithUser[]>(feed).then(async e => {
            if (e.ok) {
                return e.value as PostWithUser[];
            }else {
                throw `Cant fetch feed (${e.error.description})`;
            }
        }).catch(e => {
            throw `Cant fetch feed ${e}`;
        })
    }

    render(): React.ReactNode {
        return (
            <section className="feed" style={this.props.style}>
                {this.props.title && <Text.H1
                    text={this.props.title}
                    style={{ userSelect: "none", marginBottom: "0.5rem" }}
                />}

                {this.state.posts.map((post, i) => <React.Fragment key={"post" + i}>
                    <Tweet
                        post_content_override={post}
                        compose={this.props.compose}
                    />
                    <div className="horizontal-row" />
                </React.Fragment>)}

            </section>
        );
    }
}

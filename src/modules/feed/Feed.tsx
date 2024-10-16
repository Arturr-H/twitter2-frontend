/* Imports */
import React from "react";
import "./styles.css";
import { Tweet } from "../tweet/Tweet";
import { Backend } from "../../handlers/Backend";
import { PostWithUser } from "../tweet/TweetTypes";
import toast from "react-hot-toast";
import { Text } from "../../components/text/Text";

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
    }

    componentDidMount(): void {
        this.getFeed();
    }

    async getFeed(): Promise<void> {
        Backend.get_auth<PostWithUser[]>(this.props.feed).then(async e => {
            if (e.ok) {
                this.setState({ posts: e.value as PostWithUser[] })
            }else {
                toast(e.error.description);
            }
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
                        post_with_user={post}
                        compose={this.props.compose}
                    />
                    <div className="horizontal-row" />
                </React.Fragment>)}

            </section>
        );
    }
}

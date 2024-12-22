/* Imports */
import React from "react";
import "./styles.css";
import { Tweet } from "../tweet/Tweet";
import { Backend } from "../../handlers/Backend";
import { PostWithUser } from "../tweet/TweetTypes";
import { Text } from "../../components/text/Text";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Modal } from "../../Modal";

/* Interfaces */
interface Props {
    toggleModal: (open: boolean, modal?: Modal) => void,
    feed: string,
    title?: string,
    style?: React.CSSProperties,
    showPostReplies?: true
}
interface State {
    posts: PostWithUser[],
    loading: boolean
}

export class Feed extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            posts: [],
            loading: true
        }

        this.setFeed = this.setFeed.bind(this);
    }

    componentDidMount(): void {
        this.setFeed(this.props.feed);
    }

    async setFeed(feed: string): Promise<void> {
        this.setState({ loading: true });
        try {
            this.setState({ posts: [] }, async () => {
                this.setState({
                    posts: await this.getFeed(feed),
                    loading: false
                })
            })
        }catch (e) {
            toast(`${e}`);
            this.setState({ loading: false });
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
                        key={"post--" + i}
                        post_content_override={post}
                        toggleModal={this.props.toggleModal}
                        show_reply={this.props.showPostReplies}
                        animationIndex={i}
                    />
                    <div className="horizontal-row" />
                </React.Fragment>)}

                {this.state.loading && <div className="loader-container">
                    <Loader2 className="loader" size={"1.5rem"} color="#ccc" />
                </div>}
            </section>
        );
    }
}

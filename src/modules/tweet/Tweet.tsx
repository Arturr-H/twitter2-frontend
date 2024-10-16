/* Imports */
import React from "react";
import "./styles.css";
import { Backend } from "../../handlers/Backend";
import toast from "react-hot-toast";
import { PostWithUser } from "./TweetTypes";
import { ActionBar } from "./ActionBar";
import { TweetHeader } from "./Header";
import { TweetSidebar } from "./Sidebar";
import { TweetQuote } from "./TweetQuote";
import { Link } from "react-router-dom";
import { Text } from "../../components/text/Text";

/* Interfaces */
interface Props {
    post_with_user: PostWithUser | null,
    compose: (reply_to: number | null) => void,
}
interface State {
    liked: boolean,
    bookmarked: boolean,
    total_likes: number,
    total_replies: number,
}

export class Tweet extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.toggleBookmark = this.toggleBookmark.bind(this);
        this.toggleLike = this.toggleLike.bind(this);
        this.initialize = this.initialize.bind(this);
        this.reply = this.reply.bind(this);
    }

    componentDidMount(): void {
        this.initialize();
    }

    initialize(): void {
        if (!this.props.post_with_user) return;
        this.setState({
            liked: this.props.post_with_user.liked,
            bookmarked: this.props.post_with_user.bookmarked,
            total_likes: this.props.post_with_user.post.total_likes
                - (this.props.post_with_user.liked ? 1 : 0),
            total_replies: this.props.post_with_user.post.total_replies,
        })
    }

    /** Highlights #hashtags and @mentions */
    public static formatContent(content: string, hideDefault?: boolean): JSX.Element[] {
        const regex = /(#\w+|@\w+)/g;
        const parts = content.split(regex);

        return parts.map((part, index) => {
            if (part.startsWith('#')) {
                return (
                    <Link
                        to={`/hashtag/${part.substring(1)}`}
                        key={index}
                        className="hashtag"
                    >{part}</Link>
                );
            } else if (part.startsWith('@')) {
                return (
                    <Link
                        to={`/user/${part.substring(1)}`}
                        key={index}
                        className="mention"
                    >{part}</Link>
                );
            } else {
                return <span key={index} style={{ opacity: hideDefault === true ? 0 : 1 }} className="default-text">{part}</span>;
            }
        });
    }

    toggleLike(): void {
        if (!this.props.post_with_user) return;
        let like = !this.state.liked;
        Backend.post_auth("/post/set-like", {
            to: like, post_id: this.props.post_with_user.post.id
        }).then(e => { if (!e.ok) { toast(e.error.description); } })
        this.setState({ liked: !this.state.liked })
    }
    toggleBookmark(): void {
        if (!this.props.post_with_user) return;
        let bookmark = !this.state.bookmarked;
        Backend.post_auth("/post/set-bookmark", {
            to: bookmark, post_id: this.props.post_with_user.post.id
        }).then(e => { if (!e.ok) { toast(e.error.description); } })
        this.setState({ bookmarked: !this.state.bookmarked })
    }

    reply(): void {
        if (!this.props.post_with_user) return;
        this.props.compose(this.props.post_with_user.post.id);
    }

    render(): React.ReactNode {
        return (
            <div className="tweet">
                <TweetSidebar />

                <div className="body">
                    <TweetHeader
                        displayname={this.props.post_with_user?.user.displayname ?? null}
                        handle={this.props.post_with_user?.user.handle ?? null}
                        user_id={this.props.post_with_user?.user.user_id ?? null}
                    />

                    {/* Citation of another post if exists */}
                    {this.props.post_with_user
                        && this.props.post_with_user.post.citation
                        && 
                        
                        <Link
                            to={"/post/" + this.props.post_with_user.post.citation.post_id}
                            style={{ textDecoration: "none" }}
                        >
                            <TweetQuote
                                citation={this.props.post_with_user.post.citation}
                                author={this.props.post_with_user.user.displayname}
                            />
                        </Link>}

                    {/* Content of post */}
                    <div className="content-container">
                        {this.props.post_with_user !== null 
                            ? Tweet.formatContent(this.props.post_with_user.post.content)
                            : <Text.PSkeletalSentence lengths={[6, 4, 10, 8, 9]} />}
                    </div>

                    {/* Like, share, reply etc */}
                    {this.state && <ActionBar
                        liked={this.state.liked}
                        bookmarked={this.state.bookmarked}
                        toggleLike={this.toggleLike}
                        toggleBookmark={this.toggleBookmark}
                        total_likes={this.state.total_likes}
                        total_replies={this.state.total_replies}
                        reply={this.reply}
                    />}
                </div>
            </div>
        );
    }
}

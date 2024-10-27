import { Bookmark, Heart, MessageSquare, MoreHorizontal, Reply } from "lucide-react";
import React from "react";
import { OpinionInterface, Opinions } from "./Opinions";
import { Link } from "react-router-dom";

/* Interfaces */
interface Props {
    reply: () => void,
    toggleLike: () => void,
    toggleBookmark: () => void,
    total_likes: number,
    total_replies: number,
    post_id: number,
    liked: boolean,
    bookmarked: boolean,
    opinions: OpinionInterface[]
}
interface State {
    likes: number
}

const LIKED_COLOR = "hsl(340, 75%, 55%)";
const BOOKMARKED_COLOR = "hsl(60, 75%, 55%)";

export class ActionBar extends React.PureComponent<Props, State> {
    was_initially_liked: [boolean, number];
    constructor(props: Props) {
        super(props);
        
        this.was_initially_liked = [props.liked, props.total_likes];
        this.state = {
            likes: props.total_likes,
        }
        
        this.onBookmark = this.onBookmark.bind(this);
        this.onReply = this.onReply.bind(this);
        this.onLike = this.onLike.bind(this);
    }

    /** Increases or decreases like count
     * depending on if it's already liked
     * by the user or not */
    onLike(e: React.MouseEvent): void {
        e.stopPropagation();
        let initial = this.was_initially_liked[1];
        let liked = !this.props.liked;
        let likes;
        if (this.was_initially_liked[0]) {
            if (liked) { likes = initial; }
            else { likes = initial - 1; }
        }else {
            if (liked) { likes = initial + 1; }
            else { likes = initial; }
        }
        this.setState({ likes });
        this.props.toggleLike();
    }

    /** Bookmark post */
    onBookmark(e: React.MouseEvent): void {
        e.stopPropagation();
        this.props.toggleBookmark();
    }

    /** Reply to post */
    onReply(e: React.MouseEvent): void {
        e.stopPropagation();
        this.props.reply();
    }

    render(): React.ReactNode {
        return (
            <div className="action-bar">
                {/* Like */}
                <div
                    className="item"
                    title="Like"
                    onClick={this.onLike}
                >
                    <Heart
                        color={this.props.liked ? LIKED_COLOR : "#ccc"}
                        fill={this.props.liked ? LIKED_COLOR : "none"}
                        size={"1rem"}
                    />
                    <p
                        className="count"
                        style={{
                            color: this.props.liked ? LIKED_COLOR : "#ccc"
                        }}
                    >
                        {this.state.likes}
                    </p>
                </div>

                {/* Check replies */}
                <Link
                    className="item"
                    title="Replies"
                    to={`/post/${this.props.post_id}`}
                    style={{ textDecoration: "none" }}
                >
                    <MessageSquare
                        color={"#ccc"}
                        size={"1rem"}
                    />
                    <p className="count">
                        {this.props.total_replies}
                    </p>
                </Link>

                {this.props.opinions !== undefined 
                ? <Opinions
                    opinions={this.props.opinions}
                    post_id={this.props.post_id}
                />
                : <div style={{ flex: 1 }} />}

                {/* Bookmark button */}
                <button
                    className="item"
                    title="Save to bookmarks"
                    onClick={this.onBookmark}
                >
                    <Bookmark
                        color={this.props.bookmarked ? BOOKMARKED_COLOR : "#ccc"}
                        fill={this.props.bookmarked ? BOOKMARKED_COLOR : "none"}
                        size={"1rem"}
                    />
                </button>

                {/* Reply button */}
                <button
                    className="item"
                    title="Reply"
                    onClick={this.onReply}
                >
                    <Reply color="#ccc" size={"1rem"} />
                </button>
                <button className="item" title="More">
                    <MoreHorizontal color="#ccc" size={"1rem"} />
                </button>
            </div>
        )
    }
}
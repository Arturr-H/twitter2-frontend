import { Bookmark, Heart, MessageSquare, MoreHorizontal, Reply, Share } from "lucide-react";
import React from "react";

/* Interfaces */
interface Props {
    reply: () => void,
    toggleLike: () => void,
    toggleBookmark: () => void,
    total_likes: number,
    total_replies: number,
    liked: boolean,
    bookmarked: boolean,
}
interface State {
}

const LIKED_COLOR = "hsl(340, 75%, 55%)";
const BOOKMARKED_COLOR = "hsl(60, 75%, 55%)";

export class ActionBar extends React.PureComponent<Props, State> {

    onClick(e: React.MouseEvent, func: () => void): void {
        e.stopPropagation();
        func();
    }

    render(): React.ReactNode {
        return (
            <div className="action-bar">
                <div className="item" onClick={(e) => this.onClick(e, this.props.toggleLike)}>
                    <Heart
                        color={this.props.liked ? LIKED_COLOR : "#ccc"}
                        fill={this.props.liked ? LIKED_COLOR : "none"}
                        size={20}
                    />
                    <p
                        className="count"
                        style={{
                            color: this.props.liked ? LIKED_COLOR : "#ccc"
                        }}
                    >
                        {this.props.total_likes
                        + (this.props.liked ? 1 : 0)}
                    </p>
                </div>
                <div className="item">
                    <MessageSquare color="#ccc" size={20} />
                    <p className="count">{this.props.total_replies}</p>
                </div>

                <div style={{ flex: 1 }} />

                <button className="item" title="Share">
                    <Share color="#ccc" size={20} />
                </button>
                <button className="item" title="Save to bookmarks" onClick={(e) => this.onClick(e, this.props.toggleBookmark)}>
                    <Bookmark
                        color={this.props.bookmarked ? BOOKMARKED_COLOR : "#ccc"}
                        fill={this.props.bookmarked ? BOOKMARKED_COLOR : "none"}
                        size={20}
                    />
                </button>
                <button className="item" title="Reply" onClick={(e) => this.onClick(e, this.props.reply)}>
                    <Reply color="#ccc" size={20} />
                </button>
                <button className="item" title="More">
                    <MoreHorizontal color="#ccc" size={20} />
                </button>
            </div>
        )
    }
}
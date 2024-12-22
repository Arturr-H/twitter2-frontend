/* Imports */
import React from "react";
import "./styles.css";
import { Feed } from "../../modules/feed/Feed";
import { Flame, History, Sparkle } from "lucide-react";
import { Modal } from "../../Modal";

/* Interfaces */
interface Props {
    toggleModal: (open: boolean, modal?: Modal) => void,
}
interface State {
    feedType: FeedType;
}

enum FeedType { RECENT, POPULAR, FORYOU }

export class PostFeeds extends React.PureComponent<Props, State> {
    feed: React.RefObject<Feed> = React.createRef();

    constructor(props: Props) {
        super(props);

        this.state = {
            feedType: FeedType.RECENT
        }

        this.setFeed = this.setFeed.bind(this);
        this.setFeedType = this.setFeedType.bind(this);
    }

    setFeed(feed: string): void {
        this.feed.current?.setFeed(feed);
    }

    setFeedType(feedType: FeedType): void {
        this.setState({ feedType });
        switch (feedType) {
            case FeedType.RECENT:
                this.setFeed("/feed/newest");
                break;
            case FeedType.POPULAR:
                this.setFeed("/feed/popular");
                break;
            case FeedType.FORYOU:
                this.setFeed("/feed/for-you");
                break;
        }
    }

    render(): React.ReactNode {
        return (
            <>
                <div className="feed-tabs">
                    <button
                        onClick={() => this.setFeedType(FeedType.RECENT)}
                        className={this.state.feedType === FeedType.RECENT ? "active" : ""}
                    >
                        <History color="#ccc" size={"1rem"} />
                        Recent
                    </button>
                    <button
                        onClick={() => this.setFeedType(FeedType.POPULAR)}
                        className={this.state.feedType === FeedType.POPULAR ? "active" : ""}
                    >
                        <Flame color="#ccc" size={"1rem"} />
                        Popular
                    </button>
                    <button
                        onClick={() => this.setFeedType(FeedType.FORYOU)}
                        className={this.state.feedType === FeedType.FORYOU ? "active" : ""}
                    >
                        <Sparkle color="#ccc" size={"1rem"} />
                        For You
                    </button>
                </div>


                <Feed
                    ref={this.feed}
                    toggleModal={this.props.toggleModal}
                    title="What's happening?"
                    feed="/feed/newest"
                />
            </>
        );
    }
}

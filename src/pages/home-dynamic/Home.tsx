/* Imports */
import React from "react";
import "./styles.css";
import { Navbar } from "../../modules/navbar/Navbar";
import { SidebarLeft } from "../../modules/sidebar/SidebarLeft";
import { SidebarRight } from "../../modules/sidebar/SidebarRight";
import { Backend } from "../../handlers/Backend";
import toast from "react-hot-toast";
import { Modal } from "../../Modal";

/* Interfaces */
interface Props {
    children: JSX.Element | JSX.Element[],
    toggleModal: (open: boolean, modal?: Modal) => void,
}
interface State {
    replies_to: number | null,
    trendingHashtags: TrendingHashtag[]
}
export interface TrendingHashtag {
    tag: string,
    usage_count: number,
}

export class Home extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            replies_to: null,
            trendingHashtags: []
        };

        this.getTrendingHashtags = this.getTrendingHashtags.bind(this);
        this.toggleCompose = this.toggleCompose.bind(this);
    }

    componentDidMount(): void {
        this.getTrendingHashtags();
    }

    toggleCompose(replies_to: number | null): void {
        this.props.toggleModal(true, { type: "publish", replies_to });
    }

    async getTrendingHashtags(): Promise<void> {
        Backend.get<TrendingHashtag[]>("/feed/hashtag/trending-today").then(e => {
            if (e.ok) {
                this.setState({ trendingHashtags: e.value });
            }else{
                toast(`Could not fetch trending hashtags ${e.error.description}`);
            }
        })
    }

    render(): React.ReactNode {
        return (
            <div className="container no-padding no-gap">
                <div className="container no-padding no-gap">
                    <Navbar />
                    <section className="feed-wrapper">
                        <SidebarLeft
                            compose={this.toggleCompose}
                        />
                        <div className="dynamic-home-content-container">
                            {this.props.children}
                        </div>
                        <SidebarRight
                            trendingHashtags={this.state.trendingHashtags}
                        />
                    </section>
                </div>
            </div>
        )
    }
}

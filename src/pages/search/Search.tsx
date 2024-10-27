/* Imports */
import React, { RefObject } from "react";
import "./styles.css";
import { Feed } from "../../modules/feed/Feed";
import { Input } from "../../components/input/Input";
import { Button } from "../../components/button/Button";
import { Search as SearchIcon } from "lucide-react";

/* Interfaces */
interface Props {}
interface State {
    inputContent: string,
}
const FEED_PREFIX = "/feed/search/";
export class Search extends React.PureComponent<Props, State> {
    feedComponent: RefObject<Feed> = React.createRef();
    constructor(props: Props) {
        super(props);

        this.state = {
            inputContent: ""
        };

        this.search = this.search.bind(this);
    }

    search(): void {
        let keywords = this.state.inputContent.split(" ");
        let feed = FEED_PREFIX + encodeURIComponent(JSON.stringify(keywords));
        this.feedComponent.current?.setFeed(feed);
    }

    render(): React.ReactNode {
        return (
            <>
                <div className="search-bar">
                    <Input
                        onChange={(e) => this.setState({ inputContent: e })}
                        expand placeholder="Search" type="search" />
                    <Button
                        text=""
                        primary
                        icon={<SearchIcon color="#fff" strokeWidth={3} />}
                        onClickSync={this.search}
                    />
                </div>

                <Feed
                    compose={() => {}}
                    title="Results"
                    feed={FEED_PREFIX + "[]"}
                    ref={this.feedComponent}
                />
            </>
        );
    }
}

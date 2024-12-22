/* Imports */
import React, { RefObject } from "react";
import "./styles.css";
import { Feed } from "../../modules/feed/Feed";
import { Input } from "../../components/input/Input";
import { Button } from "../../components/button/Button";
import { Search as SearchIcon } from "lucide-react";
import { UserView } from "../../components/userview/UserView";
import { Backend } from "../../handlers/Backend";
import { UserInfo } from "../../modules/tweet/TweetTypes";
import toast from "react-hot-toast";
import { Modal } from "../../Modal";

/* Interfaces */
interface Props {
    toggleModal: (open: boolean, modal?: Modal) => void,
}
interface State {
    inputContent: string,
    popularUsers: UserInfo[],
    showPopularUsers: boolean
}
const FEED_PREFIX = "/feed/search/";
export class Search extends React.PureComponent<Props, State> {
    feedComponent: RefObject<Feed> = React.createRef();
    constructor(props: Props) {
        super(props);

        this.state = {
            inputContent: "",
            popularUsers: [],
            showPopularUsers: true
        };

        this.search = this.search.bind(this);
    }

    /* On search */
    search(): void {
        this.setState({ showPopularUsers: false });
        let keywords = this.state.inputContent.split(" ");
        let feed = FEED_PREFIX + encodeURIComponent(JSON.stringify(keywords));
        this.feedComponent.current?.setFeed(feed);
    }

    componentDidMount(): void {
        Backend.get_auth<UserInfo[]>("/user/popular").then((res) => {
            if (res.ok) {
                this.setState({ popularUsers: res.value });
            }else {
                toast.error("Failed to fetch popular users");
            }
        });
    }

    render(): React.ReactNode {
        return (
            <>
                <div className="search-bar">
                    <Input
                        onChange={(e) => {
                            this.setState({ inputContent: e })

                            if (e === "") {
                                this.setState({ showPopularUsers: true });
                            }
                        }}
                        expand placeholder="Search" type="search"
                        focused    
                    />
                    <Button
                        text=""
                        primary
                        icon={<SearchIcon color="#fff" size={"1rem"} strokeWidth={3} />}
                        onClickSync={this.search}
                    />
                </div>

                {this.state.showPopularUsers
                ? <div className="search-user-list">
                    <h1 style={{ marginBottom: "0.5rem" }}>Popular users</h1>
                    {this.state.popularUsers.map((user, i) => <UserView
                        key={`user-view-${i}`}
                        {...user}
                    />)}
                </div>
                
                : <Feed
                    toggleModal={this.props.toggleModal}
                    feed={FEED_PREFIX + "[]"}
                    ref={this.feedComponent}
                    title="Results"
                />}
            </>
        );
    }
}

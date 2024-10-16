/* Imports */
import React from "react";
import "./styles.css";
import { TrendingUp } from "lucide-react";
import { Text } from "../../components/text/Text";
import { TrendingHashtag } from "../../pages/home-dynamic/Home";
import { Link } from "react-router-dom";

/* Interfaces */
interface Props {
    trendingHashtags: TrendingHashtag[]
}
interface State {}

export class SidebarRight extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <nav className="sidebar sidebar-right">
                <div className="sidebar-inner">
                    <div className="row" style={{ gap: "0.25rem", alignItems: "center" }}>
                        <TrendingUp size={32} color="#fff" />
                        <Text.H4 text="Trending" />
                    </div>

                    {this.props.trendingHashtags.map((t, i) => <Link
                        style={{ textDecoration: "none" }}
                        className="trending-hashtag"
                        to={"/hashtag/" + t.tag}
                        key={"th" + i}
                    >
                        <Text.H6 text={"#" + t.tag} />
                        <Text.P text={t.usage_count + " posts today"} />
                    </Link>)}
                </div>
            </nav>
        );
    }
}

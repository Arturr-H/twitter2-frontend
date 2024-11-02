import React from "react";
import { Text } from "../../components/text/Text";
import { Link } from "react-router-dom";

interface Props {
    displayname: string | null,
    handle: string | null,
    user_id: number | null,
    created_at: number | null
}

/** Will desplay skeletal if null props */
export class TweetHeader extends React.PureComponent<Props> {

    /** 
     * Below 2 weeks:
     * Display either "x days ago" or "yesterday",
     * "x minutes ago" or "x hours ago", or "x seconds ago"
     * 
     * Above 2 weeks:
     * Display date in format e.g "14 Jan 2021"
     */
    getDate(): string {
        if (!this.props.created_at) return "";
        let date = new Date(this.props.created_at);
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let seconds = Math.floor(diff / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        let days = Math.floor(hours / 24);
        let weeks = Math.floor(days / 7);
        let months = Math.floor(weeks / 4);
        let years = Math.floor(months / 12);

        if (years >= 1) {
            return `${date.getDate()} ${date.toLocaleString("en", { month: "short" })} ${date.getFullYear()}`;
        }else if (months >= 1) {
            return `${date.getDate()} ${date.toLocaleString("en", { month: "short" })}`;
        }else if (weeks >= 1) {
            return `${weeks}w`;
        }else if (days >= 1) {
            return `${days}d`;
        }if (hours >= 1) {
            return `${hours}h`;
        } else if (minutes >= 1) {
            return `${minutes}m`;
        } else {
            return `${seconds}s`;
        }
    }

    render(): React.ReactNode {
        return (
            <div className="header">
                <Link
                    to={this.props.handle
                        ? ("/user/" + this.props.handle) : "#"}
                    onClick={(e) => e.stopPropagation()}
                    className="header-link"
                >
                    {this.props.displayname && this.props.handle ? <>
                        <Text.P className="displayname" text={this.props.displayname} />
                        <Text.P className="handle" text={"~" + this.props.handle} />
                    </>

                    : <>
                        <Text.PSkeletal margined length={12} />
                        <Text.PSkeletal margined length={7} />
                    </>}
                </Link>

                {this.props.created_at
                    && <Text.P className="date" text={this.getDate()} />}
            </div>
        )
    }
}
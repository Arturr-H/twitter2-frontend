import React from "react";
import { PostCitation } from "./TweetTypes";
import { Trash2 } from "lucide-react";

interface Props {
    /** The displayname of the person who
     * wrote said thing, not the person
     * who is quoting that person */
    author: string,
    citation: PostCitation,

    removeQuote?: () => void
}

export class TweetQuote extends React.PureComponent<Props> {

    /** Generates a preview of the quote
     * 
     * E.g "My mom said ***I really like potatoes***, and I do"
     * highlighting "I really like potatoes" whilst keeping some
     * context around the quote
     * 
     * This function is really cryptic but trust me it works */
    generateContentSlice(quote: PostCitation): (JSX.Element | JSX.Element[] | null)[] {
        if (!quote) return [<p>Oops...</p>];
        let b = quote.beginning;
        let e = quote.end;
        let c = quote.content_slice;
        let ellipsis = <span className="text-unimportant ellipsis">...</span>;

        const words = (s: number, e: number | null, t: "important" | "unimportant") => {
            let spans: JSX.Element[] = [];
            let words;
            if (e === null) { words = c.slice(s).split(" "); }
            else { words = c.slice(s, e).split(" "); }

            words.forEach((word: string, index: number) => {
                let last = index === words.length - 1;
                let space = true;
                if (last && c[e ?? (c.length - 2) + 1] !== " ") {
                    space = false;
                }
                spans.push(<span className={"text-" + t} key={"ws-q" + index + word + s}>
                    {word}{space ? <>&nbsp;</> : null}
                </span>);
            });

            return spans
        }

        return [
            quote.ellipsis_left ? ellipsis : null,
            words(0, b, "unimportant"),
            words(b, e, "important"),
            words(e, null, "unimportant"),
            quote.ellipsis_right ? ellipsis : null,
        ]
    }

    render(): React.ReactNode {
        return (
            <div className="post-quote-container">
                <div className="profile-image"></div>
                <span className="text name">{this.props.author}:&nbsp;&nbsp;</span>
                {this.generateContentSlice(this.props.citation)}

                {this.props.removeQuote && <button
                    className="quote-button disable"
                    title="Stop quoting a specific part of the tweet you are replying to"
                    onClick={this.props.removeQuote}
                >
                    <Trash2 size={16} color="#fff" />
                </button>}
            </div>
        )
    }
}
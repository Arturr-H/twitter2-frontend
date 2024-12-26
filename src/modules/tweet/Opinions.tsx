import React from "react";
import { Backend } from "../../handlers/Backend";
import toast from "react-hot-toast";
import { TicketPlus } from "lucide-react";
import { Modal } from "../../Modal";

interface Props {
    opinions: OpinionInterface[],
    post_id: number,
    toggleModal: (open: boolean, modal?: Modal) => void
}
export interface OpinionInterface {
    opinion: string,
    opinion_id: number,
    voted: boolean,
    votes: number
}
export interface OpinionExtraInterface {
    post_id: number,
    style?: React.CSSProperties,
    extensive?: true
}

export class Opinions extends React.PureComponent<Props> {
    constructor(props: Props) {
        super(props);
        this.addOpinion = this.addOpinion.bind(this);
    }

    addOpinion(e: React.MouseEvent<HTMLButtonElement>): void {
        e.stopPropagation();

        this.props.toggleModal(true, {
            type: "create_opinion",
            post_id: this.props.post_id
        });
    }

    render(): React.ReactNode {
        return (
            <div className="opinions">
                <div className="opinions-wrapper">
                    {this.props.opinions.map(e => 
                        <Opinion post_id={this.props.post_id} {...e} />
                    )}

                    <button
                        className="item"
                        title="Reply"
                        onClick={this.addOpinion}
                    >
                        <TicketPlus color="#555" size={"1rem"} />
                    </button>
                </div>
            </div>
        )
    }
}

interface OpinionState {
    active: boolean,
    votes: number
}
export class Opinion extends React.PureComponent<OpinionInterface & OpinionExtraInterface, OpinionState> {
    constructor(props: OpinionInterface & OpinionExtraInterface) {
        super(props);
        this.state = {
            active: this.props.voted,
            votes: this.props.votes
        };

        this.onClick = this.onClick.bind(this);
    }
    onClick(e: React.MouseEvent<HTMLButtonElement>): void {
        e.preventDefault();
        e.stopPropagation();
        const active = !this.state.active;
        this.setState({
            active,
            votes: this.state.votes + (active ? 1 : -1)
        });

        Backend.post_auth("/post/opinion/set-vote", {
            post_id: this.props.post_id,
            vote: active,
            opinion_id: this.props.opinion_id
        }).then(e => {
            if (!e.ok) {
                toast(e.error.description)
            }
        })
    }
    render(): React.ReactNode {
        return (
            <button
                onClick={this.onClick}
                className={`opinion ${this.state.active ? "active" : ""}`}
                style={this.props.style}
            >
                <p className="text">
                    {this.props.opinion}
                </p>

                {this.props.extensive && (
                    <p className="votes">&nbsp;&nbsp;{this.state.votes}</p>
                )}
            </button>
        )
    }
}

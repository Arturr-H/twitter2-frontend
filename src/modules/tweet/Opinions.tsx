import React from "react";
import { Backend } from "../../handlers/Backend";
import toast from "react-hot-toast";

interface Props {
    opinions: OpinionInterface[],
    post_id: number
}
export interface OpinionInterface {
    opinion: string,
    id: number,
    voted: boolean,
}
export interface OpinionExtraInterface {
    post_id: number
}

export class Opinions extends React.PureComponent<Props> {
    render(): React.ReactNode {
        return (
            <div className="opinions">
                {this.props.opinions.map(e => 
                    <Opinion post_id={this.props.post_id} {...e} />
                )}
            </div>
        )
    }
}

interface OpinionState {
    active: boolean
}
export class Opinion extends React.PureComponent<OpinionInterface & OpinionExtraInterface, OpinionState> {
    constructor(props: OpinionInterface & OpinionExtraInterface) {
        super(props);
        this.state = {
            active: this.props.voted
        };

        this.onClick = this.onClick.bind(this);
    }
    onClick(e: React.MouseEvent<HTMLButtonElement>): void {
        e.preventDefault();
        e.stopPropagation();
        const active = !this.state.active;
        this.setState({ active });

        Backend.post_auth("/post/opinion/set-vote", {
            post_id: this.props.post_id,
            vote: active,
            opinion_id: this.props.id
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
            >
                <p>
                    {this.props.opinion}
                </p>
            </button>
        )
    }
}

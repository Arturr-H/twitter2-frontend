/* Imports */
import React from "react";
import "./styles.css";
import { LoaderCircle } from "lucide-react";

/* Interfaces */
interface Props {
    text: string,
    onClickSync?: () => void,
    onClickAsync?: () => Promise<void>,

    primary?: true,
    destructive?: true,
    expand?: true,

    icon?: JSX.Element,
    width?: string,
    disabled?: boolean,
}
interface State {
    loading: boolean
}

export class Button extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            loading: false,
        }

        this.onClick = this.onClick.bind(this);
    }

    componentDidMount(): void {
        if (this.props.onClickAsync !== undefined && this.props.onClickSync !== undefined) {
            throw new Error("Can't have both async and sync callbacks on button")
        }
    }

    /** Runs either the async or sync function if provided */
    async onClick(): Promise<void> {
        if (this.props.disabled) { return }
        let async_f = this.props.onClickAsync !== undefined;
        let sync_f = this.props.onClickSync !== undefined;
        if (!async_f && !sync_f) { return };
        if (async_f) this.setState({ loading: true });

        let runner: () => Promise<void>;
        if (async_f) {
            runner = async () => {
                await this.props.onClickAsync!();
                this.setState({ loading: false });
            };
        }else {
            runner = async () => new Promise((resolve) => {
                resolve(this.props.onClickSync!());
            });
        }

        return runner()
    }

    render(): React.ReactNode {
        return (
            <button
                onClick={this.onClick}
                className={`button
                    ${this.props.primary && "primary"}
                    ${this.props.destructive && "destructive"}
                    ${this.props.expand && "expand"}
                    ${this.props.disabled === true && "disabled"}
                `}
                style={this.props.width ? { width: this.props.width } : {}}
            >
                <div className="icon-container">
                    {this.props.icon}
                </div>
                {this.state.loading
                    ? <LoaderCircle className="loading-icon" size={24} />
                    : this.props.text}
            </button>
        );
    }
}

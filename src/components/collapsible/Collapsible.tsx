/* Imports */
import React from "react";
import "./styles.css";
import { ChevronUp } from "lucide-react";

/* Interfaces */
interface Props {
    children: JSX.Element[] | JSX.Element | null | boolean,
    className?: string,
}
interface State {
    collapsed: boolean
}

export class Collapsible extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            collapsed: false,
        };

        this.toggleCollapsed = this.toggleCollapsed.bind(this);
    }

    toggleCollapsed(): void {
        this.setState({ collapsed: !this.state.collapsed });
    }

    render(): React.ReactNode {
        return (
            <div 
                className={`collapsible ${this.props.className ?? ""}`}
                style={{
                    height: this.state.collapsed ? "6rem" : "unset"
                }}
            >
                {this.props.children}

                <ChevronUp
                    onClick={this.toggleCollapsed}
                    color="#fff"
                    className="collapsible-chevron-up"
                    style={{
                        transform: `rotate(${this.state.collapsed ? 180 : 0}deg)`
                    }}
                />
            </div>
        );
    }
}

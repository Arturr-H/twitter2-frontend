/* Imports */
import React, { CSSProperties } from "react";
import "./styles.css";

/* Interfaces */
interface Props {
    text: string,
    className?: string,
    style?: CSSProperties
}
interface State {}

export class Text extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        // this.H1 = this.H1.bind(this);
    }

    static H1(props: Props): JSX.Element { return <h1 {...props}>{props.text}</h1> }
    static H2(props: Props): JSX.Element { return <h2 {...props}>{props.text}</h2> }
    static H3(props: Props): JSX.Element { return <h3 {...props}>{props.text}</h3> }
    static H4(props: Props): JSX.Element { return <h4 {...props}>{props.text}</h4> }
    static H5(props: Props): JSX.Element { return <h5 {...props}>{props.text}</h5> }
    static H6(props: Props): JSX.Element { return <h6 {...props}>{props.text}</h6> }
    static P(props: Props): JSX.Element { return <p {...props}>{props.text}</p> }
    
    static PSkeletal(props: { length: number, margined: boolean }): JSX.Element {
        return <p className={`skeletal ${props.margined ? "margined" : ""}`}>{"#".repeat(props.length)}</p>
    }
    static PSkeletalSentence(props: { lengths: number[] }): JSX.Element {
        return <div className="skeletal-sentence-container">
            {props.lengths.map(e => <Text.PSkeletal margined={false} length={e} />)}
        </div>
    }
}

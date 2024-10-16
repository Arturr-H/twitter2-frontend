#!/bin/bash

# Check if a component name is provided
if [ -z "$1" ]; then
    echo "Usage: ./create-page PageName"
    exit 1
fi

# Component name and folder name
PAGE_NAME=$1
FOLDER_NAME=$(echo "$PAGE_NAME" | tr '[:upper:]' '[:lower:]')

# Create the component folder
mkdir -p src/pages/$FOLDER_NAME

# Create the TSX file with the template
cat <<EOL > src/pages/$FOLDER_NAME/$PAGE_NAME.tsx
/* Imports */
import React from "react";
import "./styles.css";

/* Interfaces */
interface Props {}
interface State {}

export class $PAGE_NAME extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <div>
            </div>
        );
    }
}
EOL

# Create an empty CSS file
touch src/pages/$FOLDER_NAME/styles.css

echo "Component $COMPONENT_NAME created in src/pages/$FOLDER_NAME"

#!/bin/bash

# Check if a component name is provided
if [ -z "$1" ]; then
    echo "Usage: ./create-component.sh ComponentName"
    exit 1
fi

# Component name and folder name
COMPONENT_NAME=$1
FOLDER_NAME=$(echo "$COMPONENT_NAME" | tr '[:upper:]' '[:lower:]')

# Create the component folder
mkdir -p src/components/$FOLDER_NAME

# Create the TSX file with the template
cat <<EOL > src/components/$FOLDER_NAME/$COMPONENT_NAME.tsx
/* Imports */
import React from "react";
import "./styles.css";

/* Interfaces */
interface Props {}
interface State {}

export class $COMPONENT_NAME extends React.PureComponent<Props, State> {
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
touch src/components/$FOLDER_NAME/styles.css

echo "Component $COMPONENT_NAME created in src/components/$FOLDER_NAME"

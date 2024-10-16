#!/bin/bash

# Check if a module name is provided
if [ -z "$1" ]; then
    echo "Usage: ./create-module.sh ModuleName"
    exit 1
fi

# Module name and folder name
MODULE_NAME=$1
FOLDER_NAME=$(echo "$MODULE_NAME" | tr '[:upper:]' '[:lower:]')

# Create the module folder
mkdir -p src/modules/$FOLDER_NAME

# Create the TSX file with the template
cat <<EOL > src/modules/$FOLDER_NAME/$MODULE_NAME.tsx
/* Imports */
import React from "react";
import "./styles.css";

/* Interfaces */
interface Props {}
interface State {}

export class $MODULE_NAME extends React.PureComponent<Props, State> {
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
touch src/modules/$FOLDER_NAME/styles.css
echo "Component $MODULE_NAME created in src/modules/$FOLDER_NAME"

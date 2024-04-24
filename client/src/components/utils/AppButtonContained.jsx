import React from "react";
import { Button, Typography } from "@mui/material";

/**
 * Returns a contained button component.
 * @param {{startIcon, label:String, color: String}} props
 * @returns
 */
function AppButtonContained(props, ref) {
    const { color = "bg-accent", label, ...otherProps } = props;

    return (
        <>
            <Button
                {...otherProps}
                variant="contained"
                className={`rounded-sm ${color}`} // Use color variable for class
            >
                <Typography variant="button">{label}</Typography>
            </Button>
        </>
    );
}

export default React.forwardRef(AppButtonContained);

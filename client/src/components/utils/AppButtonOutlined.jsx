import React from "react";
import { Button, Typography } from "@mui/material";

/**
 * Returns an outlined button component.
 * @param {{startIcon, label: String, borderColor: String, textColor: String}} props
 * @returns
 */
function AppButtonOutlined(props, ref) {
    const {
        borderColor = "border-accent",
        textColor = "text-accent",
        label,
        ...otherProps
    } = props;

    return (
        <>
            <Button
                {...props}
                variant="outlined"
                className={`rounded-sm ${borderColor} ${textColor}`}
            >
                <Typography variant="button">{props.label}</Typography>
            </Button>
        </>
    );
}

export default React.forwardRef(AppButtonOutlined);

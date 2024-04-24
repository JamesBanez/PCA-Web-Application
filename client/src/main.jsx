import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { StyledEngineProvider, createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

const theme = createTheme({
	components: {
		MuiPopover: {
			defaultProps: {
				container: rootElement,
			},
		},
		MuiPopper: {
			defaultProps: {
				container: rootElement,
			},
		},
		MuiDialog: {
			defaultProps: {
				container: rootElement,
			},
		},
		MuiModal: {
			defaultProps: {
				container: rootElement,
			},
		},
	},
});

root.render(
	<React.StrictMode>
		<StyledEngineProvider injectFirst>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<ThemeProvider theme={theme}>
					<App />
				</ThemeProvider>
			</LocalizationProvider>
		</StyledEngineProvider>
	</React.StrictMode>
);

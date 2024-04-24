import React from "react";
import { Typography } from "@mui/material";

import AppButtonContained from "../utils/AppButtonContained";
import useRouting from "../routes";
import { logo } from "../../assets";

function Header({ withLogout }) {
	const { navigateToInstitutionsPage, navigateToLandingPage } = useRouting();

	const handleLogout = () => {
		localStorage.clear();
		navigateToLandingPage();
	};

	return (
		<div className="items-center h-20 px-5 py-5 flex flex-row pt-2 shadow-md border-primary justify-between">
			<a
				onClick={() => navigateToInstitutionsPage()}
				style={{ cursor: "pointer" }}>
				<div className="flex flex-col justify-center items-center">
					<img src={logo} width={220} alt={"Unable to load logo."} />
					<Typography className="font-medium">
						Developed for CHED-TC CpE
					</Typography>
				</div>
			</a>
			{withLogout && (
				<AppButtonContained label="Logout" onClick={handleLogout} />
			)}
		</div>
	);
}

export default Header;

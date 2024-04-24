import React from "react";
import { Typography } from "@mui/material";

import { logo, chedbg, teamLogo } from "../assets/index";
import AppButtonContained from "../components/utils/AppButtonContained";
import AppButtonOutlined from "../components/utils/AppButtonOutlined";
import useRouting from "../components/routes";

function LandingPage() {
	const { navigateToLogin, navigateToRegistration } = useRouting();

	return (
		<div
			className="flex justify-center items-center h-screen text-white font-inter relative"
			style={{
				backgroundImage: `url(${chedbg})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}>
			<div className="absolute inset-0 bg-accent opacity-60"></div>
			<div className="flex flex-col gap-10 text-center z-10 relative bg-primary p-10 rounded-lg">
				<div>
					<img src={logo} width={300} alt={"Unable to load logo."} />
					<Typography className="font-medium text-black">
						Developed for CHED-TC CpE
					</Typography>
				</div>
				<div className="flex flex-col gap-2">
					<AppButtonContained label="Login" onClick={() => navigateToLogin()} />
					<AppButtonOutlined
						label="Register"
						onClick={() => navigateToRegistration()}
					/>
					<Typography className="flex flex-row justify-center items-center font-medium text-black pt-6">
						Developed by{" "}
						<img src={teamLogo} width={100} alt={"Unable to load team logo."} />
					</Typography>
				</div>
			</div>
		</div>
	);
}

export default LandingPage;

import React, { useState } from "react";
import { TextField, Link, Typography } from "@mui/material";

import AppButtonContained from "../components/utils/AppButtonContained";
import useRouting from "../components/routes";
import { chedbg, teamLogo } from "../assets";
import { SERVER_URL } from "../../Globals";

function LoginPage() {
	const { navigateToInstitutionsPage } = useRouting();

	const [credentialsFormData, setCredentialsFormData] = useState({
		email: "",
		password: "",
	});

	const handleCredentialsChange = (event) => {
		const { name, value } = event.target;
		setCredentialsFormData({
			...credentialsFormData,
			[name]: value,
		});
	};

	const handleSubmit = async () => {
		// Prepares payload to send
		const payload = {
			credentials: {
				email: credentialsFormData.email,
				password: credentialsFormData.password,
			},
		};

		// Sending request to server
		const response = await fetch(SERVER_URL + "/v1/users/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});

		if (response.ok) {
			const { accessToken, refreshToken } = await response.json();

			// Store Access and Refresh Token
			localStorage.setItem("accessToken", accessToken);
			localStorage.setItem("refreshToken", refreshToken);

			setCredentialsFormData({
				email: "",
				password: "",
			});

			// Navigate to Home if success: 200
			navigateToInstitutionsPage();
		} else {
			alert("Login error. Please try again.");
		}
	};

	return (
		<div className="flex flex-col justify-center mt-8 items-center font-inter">
			<div className="flex flex-row shadow-lg w-5/6 rounded-lg bg-accent">
				<img
					src={chedbg}
					width={700}
					alt="Unable to load logo."
					className="opacity-60 rounded-l-lg"
					// style={{ backgroundColor: "rgba(59, 130, 246, 0.6)" }}
				/>
				<div className="flex flex-1 flex-col px-10 justify-center rounded-lg bg-white">
					<h1 className="text-accent">Login</h1>
					<Typography>Welcome back! Please login to continue.</Typography>
					<div className="flex flex-col mt-5 gap-3">
						{Object.keys(credentialsFormData).map((key) => (
							<TextField
								key={key}
								fullWidth
								id={`standard-basic-${key}`}
								label={
									key.charAt(0).toUpperCase() +
									key.slice(1).replace(/([A-Z])/g, " $1")
								}
								variant="standard"
								value={credentialsFormData[key]}
								onChange={handleCredentialsChange}
								type={key.includes("password") ? "password" : ""}
								autoComplete={
									key.includes("password") ? "current-password" : ""
								}
								name={key}
							/>
						))}
						<AppButtonContained label="Login" onClick={() => handleSubmit()} />
						<Typography className="mt-5">
							Don't have an account?{" "}
							<Link
								href="/register"
								underline="hover"
								className="text-accent font-bold">
								Register
							</Link>
						</Typography>
					</div>
				</div>
			</div>
			<div className="flex flex-row justify-center items-center font-medium mt-5 text-black pt-6">
				<Typography variant="caption">Developed by: </Typography>
				<img src={teamLogo} width={80} alt="Ademix" />
			</div>
		</div>
	);
}

export default LoginPage;

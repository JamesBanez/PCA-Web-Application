import React, { useState } from "react";
import { TextField, Link, Alert, AlertTitle, Typography } from "@mui/material";

import AppButtonContained from "../components/utils/AppButtonContained";
import useRouting from "../components/routes";

import { SERVER_URL } from "../../Globals";

function RegistrationPage() {
	const { navigateToLogin } = useRouting();

	const [passwordsMatchError, setPasswordsMatchError] = useState(false);
	const [infoFormData, setInfoFormData] = useState({
		firstName: "",
		middleName: "",
		lastName: "",
		suffix: "",
	});

	const [credentialsFormData, setCredentialsFormData] = useState({
		email: "",
		password: "",
		confirmPassword: "",
	});

	const handleInfoChange = (event) => {
		const { name, value } = event.target;
		setInfoFormData({
			...infoFormData,
			[name]: value,
		});
	};

	const handleCredentialsChange = (event) => {
		const { name, value } = event.target;
		setCredentialsFormData({
			...credentialsFormData,
			[name]: value,
		});
	};

	const handleSubmit = async () => {
		const { password, confirmPassword } = credentialsFormData;
		if (password !== confirmPassword) {
			setPasswordsMatchError(true);
			return; // Prevent further execution
		} else {
			setPasswordsMatchError(false);
		}

		// Preparing payload to send
		const payload = {
			credentials: {
				email: credentialsFormData.email,
				password: credentialsFormData.password,
			},
			info: {
				name: {
					firstName: infoFormData.firstName,
					lastName: infoFormData.lastName,
					middleName: infoFormData.middleName,
					suffix: infoFormData.suffix,
				},
			},
		};

		// Sending request to server
		const response = await fetch(SERVER_URL + "/v1/users/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});

		if (response.ok) {
			setInfoFormData({
				firstName: "",
				middleName: "",
				lastName: "",
				suffix: "",
			});

			setCredentialsFormData({
				email: "",
				password: "",
				confirmPassword: "",
			});

			// Proceed to LoginPage but will replace to navigateVerificationPage
			navigateToLogin();
		} else {
			// Tells the user that registration failed.
			alert("Registration failed. Please try again.");
		}
	};

	return (
		<div className="flex justify-center items-center font-inter">
			<div className="flex flex-col p-10 w-1/2 justify-center rounded-lg shadow-lg bg-white">
				<Typography className="text-accent font-bold" variant="h4">
					Register
				</Typography>
				<Typography className="mt-4" variant="inherit">
					Welcome! Create a new account.
				</Typography>
				<div className="flex flex-row mt-5 gap-3">
					{Object.keys(infoFormData).map((key) => (
						<TextField
							key={key}
							fullWidth={key.includes("suffix") ? false : true}
							id={`standard-basic-${key}`}
							label={
								key.charAt(0).toUpperCase() +
								key.slice(1).replace(/([A-Z])/g, " $1")
							}
							variant="standard"
							value={infoFormData[key]}
							onChange={handleInfoChange}
							name={key}
						/>
					))}
				</div>
				<div className="flex flex-col mt-3 gap-3">
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
							type={
								key.includes("password") || key.includes("confirmPassword")
									? "password"
									: ""
							}
							autoComplete={key.includes("password") ? "current-password" : ""}
							name={key}
						/>
					))}
					{passwordsMatchError && (
						<Alert severity="error">
							<AlertTitle>Error</AlertTitle>
							Mismatched passwords!
						</Alert>
					)}
					<AppButtonContained label="Register" onClick={handleSubmit} />
					<Typography className="mt-5">
						Already have an account?{" "}
						<Link
							href="/login"
							underline="hover"
							className="text-accent font-bold">
							Login
						</Link>
					</Typography>
				</div>
			</div>
		</div>
	);
}

export default RegistrationPage;

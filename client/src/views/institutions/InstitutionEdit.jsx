import React, { useState } from "react";
import { TextField, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

import AppButtonContained from "../../components/utils/AppButtonContained";
import AppButtonOutlined from "../../components/utils/AppButtonOutlined";
import useRouting from "../../components/routes";
import { SERVER_URL } from "../../../Globals";

function InstitutionEdit() {
	const { navigateToInstitutionsPage } = useRouting();
	const { state } = useLocation();

	const [disabled, setDisabled] = useState(false);
	const [insitutionData, setnewInstitutionFormData] = React.useState({
		institutionName: state.institutionName,
		completeAddress: state.completeAddress,
		city: state.city,
		region: state.region,
	});

	// Responsible for update text fields
	const onHandleSetNewInstitutionsChange = (event) => {
		const { name, value } = event.target;
		setnewInstitutionFormData({
			...insitutionData,
			[name]: value,
		});
	};

	// Function to submit entries to backend
	const handleSubmit = async () => {
		const accessToken = localStorage.getItem("accessToken");

		// Prepares payload to send
		const payload = {
			institutionName: insitutionData.institutionName,
			completeAddress: insitutionData.completeAddress,
			city: insitutionData.city,
			region: insitutionData.region,
		};

		// Sends request to server
		const response = await fetch(`${SERVER_URL}/v1/institutions/${state._id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify(payload),
		});

		if (response.ok) {
			console.log("Payload submitted:", payload);
			navigateToInstitutionsPage();
		} else {
			console.log(response.message);
			// <Alert severity="error">
			//     <AlertTitle>Invalid Input</AlertTitle>
			//     You have entered invalid input details. Please try again.
			// </Alert>;
		}
	};

	return (
		<div className="flex justify-center items-center">
			<div className="flex flex-col p-10 w-1/2 justify-center rounded-lg shadow-lg bg-white">
				<Typography className="text-accent font-bold" variant="h4">
					Edit institution
				</Typography>
				<Typography>
					Kindly fill up the form below with institution's details.
				</Typography>

				<div className="flex flex-col mt-8 gap-5">
					{Object.keys(insitutionData).map((fieldName, index) => (
						<TextField
							key={index}
							fullWidth
							label={
								fieldName.charAt(0).toUpperCase() +
								fieldName.slice(1).replace(/([A-Z])/g, " $1")
							}
							value={insitutionData[fieldName]}
							name={fieldName}
							onChange={onHandleSetNewInstitutionsChange}
						/>
					))}
				</div>
				<div className="flex flex-row mt-5 justify-end gap-2">
					<AppButtonContained
						label="Submit"
						onClick={async () => {
							setDisabled(true);
							await handleSubmit();
							setDisabled(false);
						}}
						disabled={disabled}
					/>
					<AppButtonOutlined
						label="Cancel"
						onClick={() => navigateToInstitutionsPage()}
					/>
				</div>
			</div>
		</div>
	);
}

export default InstitutionEdit;

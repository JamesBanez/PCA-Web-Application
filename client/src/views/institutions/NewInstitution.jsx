import React, { useState } from "react";
import { TextField, Typography } from "@mui/material";

import useRouting from "../../components/routes";
import AppButtonContained from "../../components/utils/AppButtonContained";
import AppButtonOutlined from "../../components/utils/AppButtonOutlined";
import { SERVER_URL } from "../../../Globals";

function NewInstitution() {
	const { navigateToInstitutionsPage } = useRouting();
	const [disabled, setDisabled] = useState(false);
	const [newInstitutionFormData, setnewInstitutionFormData] = React.useState({
		institutionName: "",
		completeAddress: "",
		city: "",
		region: "",
	});

	const onHandleSetNewInstitutionsChange = (event) => {
		const { name, value } = event.target;
		setnewInstitutionFormData({
			...newInstitutionFormData,
			[name]: value,
		});
	};

	// Function to submit entries to backend
	const handleSubmit = async () => {
		const accessToken = localStorage.getItem("accessToken");
		// Prepares payload to send
		const payload = {
			institutionName: newInstitutionFormData.institutionName,
			completeAddress: newInstitutionFormData.completeAddress,
			city: newInstitutionFormData.city,
			region: newInstitutionFormData.region,
		};

		// Sends request to server
		const response = await fetch(SERVER_URL + "/v1/institutions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify(payload),
		});

		if (response.ok) {
			setnewInstitutionFormData({
				institutionName: "",
				completeAddress: "",
				city: "",
				region: "",
			});

			console.log("Payload submitted:", newInstitutionFormData);
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
					Add new institution
				</Typography>
				<Typography>
					Kindly fill up the form below with institution's details.
				</Typography>

				<div className="flex flex-col mt-8 gap-5">
					{Object.keys(newInstitutionFormData).map((fieldName, index) => (
						<TextField
							key={index}
							fullWidth
							label={
								fieldName.charAt(0).toUpperCase() +
								fieldName.slice(1).replace(/([A-Z])/g, " $1")
							}
							value={newInstitutionFormData[fieldName]}
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

export default NewInstitution;

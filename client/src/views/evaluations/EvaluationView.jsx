import React, { useEffect, useState } from "react";
import DownloadIcon from "@mui/icons-material/Download";
import {
	List,
	ListItem,
	TextField,
	IconButton,
	Card,
	Typography,
} from "@mui/material";
import { useLocation } from "react-router-dom";

import AppButtonContained from "../../components/utils/AppButtonContained";
import useRouting from "../../components/routes";
import { SERVER_URL } from "../../../Globals";

function EvaluationView() {
	const { navigateToEvaluationsPage } = useRouting();

	const { state } = useLocation();
	const [institutionData, setInstitutionData] = useState({});
	const [listOfFiles, setListOfFiles] = useState([]);

	const singleEvaluation = {
		id: state._id, // Evaluation ID
		ownedBy: state.ownedBy, // Institution ID that owns this evaluation form
		dateOfEvaluation: state.dateOfEvaluation,
		evaluator: state.evaluator,
		governmentAuthority: state.governmentAuthority,
		program: state.program,
		kindOfVisit: state.kindOfVisit,
	};

	// Filter out ownedBy and dateOfEvaluation keys
	const filteredKeys = Object.keys(singleEvaluation).filter(
		(key) => key !== "ownedBy" && key !== "dateOfEvaluation"
	);

	// Used to get institution data that owns this evaluation entry
	const fetchInstitutionData = async () => {
		// Gets access token from local storage
		const accessToken = localStorage.getItem("accessToken");

		// Sends request to the server
		const response = await fetch(
			SERVER_URL + `/v1/institutions/${state.ownedBy}`,
			{
				method: "GET",
				headers: {
					authorization: `Bearer ${accessToken}`,
				},
			}
		);

		const jsonBody = await response.json();
		setInstitutionData(jsonBody[0]);
	};

	const fetchSavedFiles = async () => {
		// Gets access token from local storage
		const accessToken = localStorage.getItem("accessToken");

		const response = await fetch(SERVER_URL + `/v1/files/${state._id}/`, {
			method: "GET",
			headers: {
				authorization: `Bearer ${accessToken}`,
			},
		});

		// Get a single entry from the list
		const result = await response.json();
		setListOfFiles([...result]);
	};

	useEffect(() => {
		fetchInstitutionData();
		fetchSavedFiles();
	}, []);

	return (
		<div className="flex justify-center items-center">
			<div className="flex flex-col p-10 w-1/2 justify-center rounded-lg shadow-lg bg-white">
				<Typography className="font-bold" variant="h4">
					{institutionData.institutionName}
				</Typography>
				<Typography variant="caption">
					Institution ID: {singleEvaluation.ownedBy}
				</Typography>
				<Typography variant="caption">
					Evaluation ID: {singleEvaluation.id}
				</Typography>
				<Typography variant="h6">
					Date of Evaluation: {singleEvaluation.dateOfEvaluation}
				</Typography>
				<div className="flex flex-row gap-10 justify-center">
					<div className="flex flex-1">
						<div className="flex flex-col flex-1 w-1/2 mt-10 gap-5">
							{filteredKeys.map((key, index) => (
								<TextField
									key={index}
									fullWidth
									label={
										key.charAt(0).toUpperCase() +
										key.slice(1).replace(/([A-Z])/g, " $1")
									}
									InputProps={{
										readOnly: true,
									}}
									value={singleEvaluation[key]}
								/>
							))}
						</div>
					</div>
					<div className="flex flex-1">
						<div className="flex-col">
							<Typography variant="inherit" className="font-bold">
								Files
							</Typography>
							{listOfFiles.length > 0 ? (
								<List>
									{listOfFiles.map((value, index) => (
										<Card
											className="w-full mt-4 py-2 px-1"
											key={value._id}
											variant="elevation">
											<ListItem
												secondaryAction={
													<IconButton edge="end">
														<DownloadIcon />
													</IconButton>
												}
												onClick={() => console.log("Downloading!")}>
												<Typography className="text-xs">
													{value.filename}
												</Typography>
											</ListItem>
										</Card>
									))}
								</List>
							) : (
								<Typography className="mt-4">No Files Uploaded.</Typography>
							)}
						</div>
					</div>
				</div>
				<div className="mt-8 self-end">
					<AppButtonContained
						label="Back"
						onClick={() => navigateToEvaluationsPage(institutionData)}
					/>
				</div>
			</div>
		</div>
	);
}

export default EvaluationView;

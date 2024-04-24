import React, { useEffect, useState } from "react";
import {
	Button,
	TextField,
	IconButton,
	Card,
	Typography,
	List,
	ListItem,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import CloudUpload from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { useLocation } from "react-router-dom";

import AppButtonContained from "../../components/utils/AppButtonContained";
import useRouting from "../../components/routes";
import { SERVER_URL } from "../../../Globals";

const VisuallyHiddenInput = styled("input")({
	clip: "rect(0 0 0 0)",
	clipPath: "inset(50%)",
	height: 1,
	overflow: "hidden",
	position: "absolute",
	bottom: 0,
	left: 0,
	whiteSpace: "nowrap",
	width: 1,
});

function EvaluationEdit() {
	const { navigateToEvaluationsPage } = useRouting();
	const { state } = useLocation();

	const [disabled, setDisabled] = useState(false);
	const [institutionData, setInstitutionData] = useState({});
	const [listOfFiles, setListOfFiles] = useState([]);
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const [singleEvaluation, setSingleEvaluation] = useState({
		id: state._id,
		ownedBy: state.ownedBy,
		dateOfEvaluation: state.dateOfEvaluation,
		evaluator: state.evaluator,
		governmentAuthority: state.governmentAuthority,
		program: state.program,
		kindOfVisit: state.kindOfVisit,
	});

	// Filter out ownedBy and dateOfEvaluation keys
	const filteredKeys = Object.keys(singleEvaluation).filter(
		(key) => key !== "ownedBy" && key !== "dateOfEvaluation" && key !== "id"
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

	// Responsible for updating the files list
	const handleFileChange = (event) => {
		const files = event.target.files;
		setUploadedFiles((currentValue) => [...currentValue, ...files]);
	};

	// Function to submit entries to backend
	const handleSubmit = async () => {
		const accessToken = localStorage.getItem("accessToken");

		// Prepare payload to send for text data
		const payload = {
			ownedBy: singleEvaluation.ownedBy,
			dateOfEvaluation: singleEvaluation.dateOfEvaluation.toString(),
			evaluator: singleEvaluation.evaluator,
			governmentAuthority: singleEvaluation.governmentAuthority,
			kindOfVisit: singleEvaluation.kindOfVisit,
			program: singleEvaluation.program,
		};

		// Sends the request to the server
		const response = await fetch(
			SERVER_URL +
				`/v1/evaluations/${singleEvaluation.ownedBy}/${singleEvaluation.id}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					authorization: `Bearers ${accessToken}`,
				},
				body: JSON.stringify(payload),
			}
		);

		if (response.ok) {
			const jsonBody = await response.json();

			console.log("Response ok!");

			// Implement here file upload to backend
			if (uploadedFiles) {
				// Converts files into blobs
				console.log("Uploading files!");

				for (const file of uploadedFiles) {
					const formData = new FormData();
					formData.append("file", file);

					const response = await fetch(
						SERVER_URL + `/v1/files/${jsonBody._id}`,
						{
							method: "POST",
							headers: {
								authorization: `Bearer ${accessToken}`,
							},
							body: formData,
						}
					);

					if (response.ok) {
						console.log("File uploaded!");
					} else {
						console.error("Error uploading files.");
					}
				}
			}

			navigateToEvaluationsPage(institutionData);
		} else {
			console.log(response.message);
		}
	};

	// Responsible for updating the forms
	const handleFormChange = (name, value) => {
		setSingleEvaluation({
			...singleEvaluation,
			[name]: value,
		});
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
									name={key}
									key={index}
									fullWidth
									label={
										key.charAt(0).toUpperCase() +
										key.slice(1).replace(/([A-Z])/g, " $1")
									}
									value={singleEvaluation[key]}
									onChange={(event) =>
										handleFormChange(event.target.name, event.target.value)
									}
								/>
							))}
						</div>
					</div>
					<div className="flex flex-1">
						<div className="flex-col">
							<Typography>
								<b>Files</b>
							</Typography>
							{listOfFiles.length > 0 ? (
								<List>
									{listOfFiles.map((value) => (
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
								<Typography variant="body2">No Files Uploaded.</Typography>
							)}
						</div>
					</div>
				</div>

				<div className="flex flex-row gap-3 my-4">
					<Button
						component={"label"}
						className="w-60"
						variant={"contained"}
						startIcon={<CloudUpload />}
						onChange={handleFileChange}>
						Upload file
						<VisuallyHiddenInput type="file" />
					</Button>
					{/* Display uploaded file names */}
					{uploadedFiles.length === 0 ? (
						<div className="self-center">No Files Selected</div>
					) : (
						<div className="w-3/4 overflow-hidden self-center">
							<Typography className="truncate">
								{Array.from(uploadedFiles)
									.map((file) => file.name)
									.join(", ")}
							</Typography>
						</div>
					)}
				</div>
				<div className="flex flex-row mt-8 self-end gap-4">
					<AppButtonContained
						label="Submit"
						onClick={async () => {
							setDisabled(true);
							await handleSubmit();
							setDisabled(false);
						}}
						disabled={disabled}
					/>
					<AppButtonContained
						label="Back"
						onClick={() => navigateToEvaluationsPage(institutionData)}
					/>
				</div>
			</div>
		</div>
	);
}

export default EvaluationEdit;

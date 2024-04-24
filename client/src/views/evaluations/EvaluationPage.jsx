import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { useLocation } from "react-router-dom";

import AppButtonContained from "../../components/utils/AppButtonContained.jsx";
import EvaluationTable from "../../components/utils/EvaluationTable.jsx";
import InstitutionBlock from "../../components/utils/InstitutionBlock.jsx";
import useRouting from "../../components/routes.jsx";
import { SERVER_URL } from "../../../Globals.js";
import { tipLogo } from "../../assets/index.js";

function EvaluationPage() {
	// Used for fetching row data from navigate()
	const { state } = useLocation();
	const { navigateToCreateEvaluation } = useRouting();

	const [rows, setRows] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");

	const singleInstitution = {
		logoSrc: tipLogo,
		institutionName: state.institutionName,
		completeAddress: state.completeAddress,
		city: state.city,
		region: state.region,
	};

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		// Gets access token from session storage
		const accessToken = localStorage.getItem("accessToken");

		// Sends request to the server
		const response = await fetch(SERVER_URL + `/v1/evaluations/${state._id}/`, {
			method: "GET",
			headers: {
				authorization: `Bearer ${accessToken}`,
			},
		});

		const data = await response.json();
		setRows(data);
	};

	// Function to handle search input change
	const handleSearchInputChange = (event) => {
		setSearchQuery(event.target.value);
	};

	// Function to filter rows based on search query
	const filteredRows = rows.filter((row) => {
		// Customize this filtering logic according to your data structure
		const isIncluded =
			row.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
			row.evaluator.toLowerCase().includes(searchQuery.toLowerCase());

		if (isIncluded) return row;
	});

	const refresh = () => {
		fetchData();
	};

	return (
		<div className="p-5">
			{/*Pass currently viewing institution*/}
			<InstitutionBlock
				logoSrc={singleInstitution.logoSrc}
				institutionName={singleInstitution.institutionName}
				completeAddress={singleInstitution.completeAddress}
				city={singleInstitution.city}
				region={singleInstitution.region}
			/>

			<div className="flex flex-row justify-between mt-5 items-center md:shrink-0">
				<TextField
					className="w-5/6 md:4/5"
					label="Search"
					id="search"
					value={searchQuery}
					onChange={handleSearchInputChange}
				/>
				<div className="flex justify-end gap-2 md:w-full">
					<AppButtonContained
						label="Create"
						onClick={() => navigateToCreateEvaluation(state)}
					/>
				</div>
			</div>

			<EvaluationTable rows={filteredRows} refresh={refresh} />
		</div>
	);
}

export default EvaluationPage;

import React, { useState, useEffect } from "react";
import { Typography, TextField } from "@mui/material";

import AppButtonContained from "../../components/utils/AppButtonContained.jsx";
import InstitutionTable from "../../components/utils/InstitutionTable.jsx";
import useRouting from "../../components/routes.jsx";
import { SERVER_URL } from "../../../Globals.js";

function HomePage() {
	const [rows, setRows] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");

	const { navigateToCreateInstitution } = useRouting();

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		// Gets access token from local storage
		const accessToken = localStorage.getItem("accessToken");

		// Sends request to the server
		const response = await fetch(SERVER_URL + "/v1/institutions/", {
			method: "GET",
			headers: {
				authorization: `Bearer ${accessToken}`,
			},
		});

		const jsonBody = await response.json();
		setRows(jsonBody);
	};

	// Function to handle search input change
	const handleSearchInputChange = (event) => {
		setSearchQuery(event.target.value);
	};

	// Function to filter rows based on search query
	const filteredRows = rows.filter((row) => {
		// Customize this filtering logic according to your data structure
		const isIncluded =
			row.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			row.completeAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
			row.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
			row.region.toLowerCase().includes(searchQuery.toLowerCase());

		if (isIncluded) return row;
	});

	const refresh = () => {
		fetchData();
	};

	return (
		<div className="p-5">
			<Typography className="font-bold" variant="h4">
				List of Institutions
			</Typography>
			<div className="flex flex-row justify-between mt-2 items-center md:shrink-0">
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
						onClick={() => navigateToCreateInstitution()}
					/>
				</div>
			</div>
			<InstitutionTable rows={filteredRows} refresh={refresh} />
		</div>
	);
}

export default HomePage;

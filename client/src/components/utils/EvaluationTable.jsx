import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { faker } from "@faker-js/faker";

import AppButtonContained from "../utils/AppButtonContained";
import AppButtonOutlined from "../utils/AppButtonOutlined";
import useRouting from "../routes";
import { SERVER_URL } from "../../../Globals";

/**
 * Gets the internal row ID of a row.
 * @param {number} row
 * @returns
 */
function _getRowId(row) {
	return row._id ? row._id : row.internalId;
}

/**
 * Provides sample data using Faker-js.
 * @param {number} count
 * @returns {Array<Object>}
 */
function _getSampleData(count = 100) {
	let rows = [];
	for (let i = 0; i < count; i++) {
		rows.push({
			internalId: i,
			dateOfEvaluation: faker.date.anytime(),
			kindOfVisit: faker.lorem.words(),
			evaluator: faker.person.fullName(),
			remarks: faker.lorem.words(),
		});
	}

	return rows;
}

/**
 * A React component that displays the list of evaluations of the selected institution.
 * @returns {React.Component}
 */
function EvaluationTable(props, ref) {
	// Defines the column of the table
	const columns = [
		{
			field: "dateOfEvaluation",
			headerName: "Date of Evaluation (mm/dd/yyyy)",
			flex: 2,
		},
		{ field: "program", headerName: "Program", flex: 2 },
		{ field: "evaluator", headerName: "Evaluator", flex: 2 },
		{
			field: "action",
			headerName: "Action",
			flex: 2,
			sortable: false,
			renderCell: function (params) {
				const { row } = params;
				const { navigateToEvaluationView, navigateToEvaluationEdit } =
					useRouting();

				const handleDelete = async (row) => {
					const accessToken = localStorage.getItem("accessToken");
					await fetch(
						`${SERVER_URL}/v1/evaluations/${row.ownedBy}/${row._id}`,
						{
							method: "DELETE",
							headers: {
								authorization: `Bearer ${accessToken}`,
							},
						}
					);

					props.refresh(); // Refreshes page
				};

				return (
					<>
						<div className="flex gap-2 items-center justify-center">
							<AppButtonContained
								startIcon={null}
								label="View"
								onClick={() => navigateToEvaluationView(row)}
							/>
							<AppButtonOutlined
								startIcon={null}
								label="Edit"
								onClick={() => navigateToEvaluationEdit(row)}
							/>
							<AppButtonContained
								label="Delete"
								color="bg-red-700"
								onClick={() => handleDelete(row)}
							/>
						</div>
					</>
				);
			},
		},
	];

	return (
		<>
			<div className="my-4 border-2 border-text rounded-xl overflow-auto">
				<DataGrid
					getRowId={_getRowId}
					rows={props.rows}
					columns={columns}
					initialState={{
						pagination: {
							paginationModel: { page: 0, pageSize: 10 },
						},
					}}
					pageSizeOptions={[10, 25, 50, 100]}
					checkboxSelection
					disableRowSelectionOnClick></DataGrid>
			</div>
		</>
	);
}

export default React.forwardRef(EvaluationTable);

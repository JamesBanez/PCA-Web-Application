import React, { useState } from "react";
import {
    TextField,
    Typography,
    Select,
    InputLabel,
    MenuItem,
    FormControl,
    Paper,
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from "@mui/material";
import AppButtonContained from "../components/utils/AppButtonContained";
import AppButtonOutlined from "../components/utils/AppButtonOutlined";
import useRouting from "../components/routes";
import { SERVER_URL } from "../../Globals";

export default function AdminPage() {
    const { navigateToEvaluationsPage } = useRouting();

    const [fieldName, setFieldName] = useState("");
    const [fieldType, setFieldType] = useState("");
    const [fieldsList, setFieldsList] = useState([]);

    const handleFieldName = (event) => {
        setFieldName(event.target.value);
    };

    const handleFieldTypeChange = (event) => {
        setFieldType(event.target.value);
    };

    const handleAddField = async () => {
        const accessToken = localStorage.getItem("accessToken");

        const payload = [
            {
                schemaName: "evaluation",
                newField: fieldName,
                fieldType: fieldType,
                opts: {
                    required: true,
                },
            },
        ];

        // Send request to server
        const response = await fetch(SERVER_URL + `/v1/admin/fields`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(fieldsList),
        });

        if (response.ok) {
            setFieldsList(payload);
            setFieldName("");
            setFieldType("");
        } else {
            console.log(response.message);
            setFieldName("");
            setFieldType("");
            alert("Invalid operation. Try again.");
        }
    };

    const handleClearButton = () => {
        setFieldName("");
        setFieldType("");
    };

    return (
        <div className="flex justify-center items-center">
            <div className="flex flex-col p-10 w-1/2 justify-center rounded-lg shadow-lg bg-white">
                <Typography className="text-accent font-bold" variant="h4">
                    Edit evaluation fields
                </Typography>
                <Typography>Add new custom fields.</Typography>
                <div className="flex flex-row mt-5 gap-10">
                    <div className="flex flex-1 flex-col gap-5">
                        <Typography className="font-bold text-2xl">
                            Add New Field
                        </Typography>
                        <TextField
                            id="filled-basic"
                            label="Name of Field"
                            variant="filled"
                            value={fieldName}
                            onChange={handleFieldName}
                        />
                        <FormControl>
                            <InputLabel>Field Type</InputLabel>
                            <Select
                                value={fieldType}
                                onChange={handleFieldTypeChange}
                                label="Field Type"
                            >
                                {/*Items to select */}
                                <MenuItem value="string">Text Entry</MenuItem>
                                <MenuItem value="date">Date</MenuItem>
                                <MenuItem value="object">File Upload</MenuItem>
                            </Select>
                        </FormControl>
                        <div className="flex gap-2">
                            <AppButtonOutlined
                                label="Back"
                                onClick={() => navigateToEvaluationsPage()}
                            />
                            <AppButtonOutlined
                                label="Clear"
                                onClick={handleClearButton}
                            />
                            <AppButtonContained
                                label="Add Field"
                                onClick={handleAddField}
                            />
                        </div>
                    </div>
                    <div className="flex flex-1 flex-col">
                        <TableContainer
                            component={Paper}
                            id="table"
                            style={{ height: 250, overflowY: "auto" }}
                        >
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Field Name</TableCell>
                                        <TableCell>Field Type</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {fieldsList.map((field, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{field.name}</TableCell>
                                            <TableCell>{field.type}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
                <div className="flex flex-col mt-8 gap-5"></div>
            </div>
        </div>
    );
}

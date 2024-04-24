import React from "react";
import { Typography } from "@mui/material";

const InstitutionBlock = ({
	logoSrc,
	institutionName,
	completeAddress,
	city,
	region,
}) => {
	return (
		<div className="flex flex-row items-center">
			{/* <img src={logoSrc} width={200} alt={"Unable to load logo."} /> */}
			<div className="flex flex-col">
				<Typography className="font-bold" variant="h4">
					{institutionName}
				</Typography>
				<Typography>
					{completeAddress}, {city}, {region}
				</Typography>
			</div>
		</div>
	);
};

export default InstitutionBlock;

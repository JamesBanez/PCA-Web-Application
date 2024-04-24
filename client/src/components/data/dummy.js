import { tipLogo } from "../../assets";

const institutionsData = [
    {
        id: 1,
        nameOfInstitution:
            "Technological Institute of the Philippines - Quezon City",
        address: "938 Aurora Blvd., Cubao",
        city: "Quezon City",
        region: "NCR",
    },
    {
        id: 2,
        nameOfInstitution:
            "Technological Institute of the Philippines - Manila",
        address: "321 Pasqual Casal Street",
        city: "Manila",
        region: "NCR",
    },
    {
        id: 3,
        nameOfInstitution: "Polytechnic University of the Philippines",
        address: "1016 Anona, Sta. Mesa",
        city: "Manila",
        region: "NCR",
    },
    {
        id: 4,
        nameOfInstitution: "University of the Philippines - Diliman",
        address: "Guerrero St., Cor. Dagohoy",
        city: "Quezon City",
        region: "NCR",
    },
    {
        id: 5,
        nameOfInstitution: "Philippine Normal University",
        address: "104 Ermita, Taft Avenue",
        city: "Manila",
        region: "NCR",
    },
    {
        id: 6,
        nameOfInstitution: "National University",
        address: "551 M.F. Jhocson St., Sampalo",
        city: "Manila",
        region: "NCR",
    },
    {
        id: 7,
        nameOfInstitution: "Pamantasang Lungsod ng Maynila",
        address: "Gen. Luna Corner, Muralla St.",
        city: "Manila",
        region: "NCR",
    },
];

const singleInstitution = {
    logoSrc: tipLogo,
    institutionName: "Technological Institute of the Philippines",
    address: "938 Aurora Boulevard, Cubao, Quezon City",
    telephoneNumber: "(+6) 8911-0964",
    email: "info@tip.edu.ph",
};

export default [institutionsData, singleInstitution];

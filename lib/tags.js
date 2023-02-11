import { map } from "lodash";

const tags = {
  Countries: [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burma",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Democratic Republic of Congo",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Ivory Coast",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kosovo",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "North Macedonia",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Korea",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon",
    "Islands",
    "Somalia",
    "South Africa",
    "South Korea",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican City",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ],
  Regions: ["Africa", "Americas", "Asia", "Europe", "Oceania", "Schengen"],
  "General destinations": [
    "Beaches",
    "Mountains",
    "Islands",
    "Deserts",
    "National Parks",
    "Ski resorts",
    "Tourist Center",
  ],
  "Travel Planning": [
    "Budgeting",
    "Itineraries",
    "Trip planning",
    "Family travel",
  ],
  Accommodations: ["Hotels", "Hostels", "Vacation rentals", "Camping"],
  Transportation: ["Flights", "Trains", "Buses", "Driving"],
  "Food and Drink": ["Restaurants", "Street food", "Local cuisine"],
  "Activities and Attractions": [
    "Sightseeing",
    "Hiking",
    "Outdoor activities",
    "Landmarks",
    "Museums",
  ],
  "Culture and History": ["Language", "Customs", "Cultural experiences"],
  "Safety and Health": [
    "Travel insurance",
    "Vaccinations",
    "Emergency situations",
  ],
  "Visa and Immigration": [
    "Tourist Visa",
    "Business Visa",
    "Student Visa",
    "Work Visa",
    "Permanent Residency",
    "Temporary Residence",
    "Visa requirements",
    "Visa application process",
    "Visa extension",
    "Immigration procedures",
    "Border crossings",
    "Electronic travel authorization",
  ],
  "Packing and Luggage": [
    "What to pack",
    "How to pack",
    "Luggage recommendations",
  ],
  "Gadgets and Technology": [
    "Travel apps",
    "Cameras",
    "Travel-related technology",
  ],
  "Study Abroad": [
    "Study abroad programs",
    "Language immersion programs",
    "Study abroad scholarships",
    "Academic credit transfer",
    "Student housing",
    "Student visas",
    "Cultural adjustment",
    "Internship opportunities",
    "Career opportunities",
    "Re-entry and readjustment",
  ],
};

const tagsArray = map(tags, (value, key) => {
  return {
    item: key,
    options: map(value, (title) => {
      return { title };
    }),
  };
});

export default tagsArray;
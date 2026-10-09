import { useState, type FormEvent } from "react";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { CountrySelect } from "./CountrySelect";
import { ApiError } from "../lib/api";
import { useAuth } from "../context/contexts";
import { isEmail, isPhone } from "../lib/formValidation";

type Values = {
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  country: string;
  businessType: string;
  supplyFormat: string;
  estimatedMonthlyPurchasing: string;
  productsOfInterest: string;
  additionalRequirements: string;
  password: string;
  confirmPassword: string;
  confirmation: boolean;
};

type Errors = Partial<Record<keyof Values, string>>;

const initial: Values = {
  fullName: "",
  businessName: "",
  email: "",
  phone: "",
  country: "",
  businessType: "",
  supplyFormat: "",
  estimatedMonthlyPurchasing: "",
  productsOfInterest: "",
  additionalRequirements: "",
  password: "",
  confirmPassword: "",
  confirmation: false,
};

const businessTypes = [
  "Distributor / wholesaler",
  "Clinic / wellness centre",
  "Pharmacy",
  "Laboratory / research organisation",
  "Online retailer / eCommerce",
  "Brand / private label business",
  "Other",
];

const supplyFormats = ["ONYX branded", "White label", "Cartridge-only"];

const purchasingVolumes = [
  "Under £2,500 / month",
  "£2,500–£5,000 / month",
  "£5,000–£10,000 / month",
  "£10,000–£25,000 / month",
  "£25,000+ / month",
];

const productOptions = [
  "Peptide pens",
  "Cartridges",
  "Vials",
  "Multiple product formats",
  "Not sure yet",
];


type PhoneCountry = {
  name: string;
  iso2: string;
  dialCode: string;
};

const phoneCountries: PhoneCountry[] = [
  { name: "United Kingdom", iso2: "GB", dialCode: "+44" },
  { name: "United States", iso2: "US", dialCode: "+1" },
  { name: "Canada", iso2: "CA", dialCode: "+1" },
  { name: "United Arab Emirates", iso2: "AE", dialCode: "+971" },
  { name: "Australia", iso2: "AU", dialCode: "+61" },
  { name: "Germany", iso2: "DE", dialCode: "+49" },
  { name: "France", iso2: "FR", dialCode: "+33" },
  { name: "Netherlands", iso2: "NL", dialCode: "+31" },
  { name: "Spain", iso2: "ES", dialCode: "+34" },
  { name: "Italy", iso2: "IT", dialCode: "+39" },
  { name: "Saudi Arabia", iso2: "SA", dialCode: "+966" },
  { name: "India", iso2: "IN", dialCode: "+91" },
  { name: "Singapore", iso2: "SG", dialCode: "+65" },
  { name: "New Zealand", iso2: "NZ", dialCode: "+64" },
  { name: "Afghanistan", iso2: "AF", dialCode: "+93" },
  { name: "Albania", iso2: "AL", dialCode: "+355" },
  { name: "Algeria", iso2: "DZ", dialCode: "+213" },
  { name: "American Samoa", iso2: "AS", dialCode: "+1684" },
  { name: "Angola", iso2: "AO", dialCode: "+244" },
  { name: "Anguilla", iso2: "AI", dialCode: "+1264" },
  { name: "Antigua and Barbuda", iso2: "AG", dialCode: "+1268" },
  { name: "Argentina", iso2: "AR", dialCode: "+54" },
  { name: "Armenia", iso2: "AM", dialCode: "+374" },
  { name: "Aruba", iso2: "AW", dialCode: "+297" },
  { name: "Austria", iso2: "AT", dialCode: "+43" },
  { name: "Azerbaijan", iso2: "AZ", dialCode: "+994" },
  { name: "Bahrain", iso2: "BH", dialCode: "+973" },
  { name: "Bangladesh", iso2: "BD", dialCode: "+880" },
  { name: "Barbados", iso2: "BB", dialCode: "+1246" },
  { name: "Belarus", iso2: "BY", dialCode: "+375" },
  { name: "Belgium", iso2: "BE", dialCode: "+32" },
  { name: "Belize", iso2: "BZ", dialCode: "+501" },
  { name: "Benin", iso2: "BJ", dialCode: "+229" },
  { name: "Bermuda", iso2: "BM", dialCode: "+1441" },
  { name: "Bhutan", iso2: "BT", dialCode: "+975" },
  { name: "Bolivia", iso2: "BO", dialCode: "+591" },
  { name: "Bosnia and Herzegovina", iso2: "BA", dialCode: "+387" },
  { name: "Botswana", iso2: "BW", dialCode: "+267" },
  { name: "Brazil", iso2: "BR", dialCode: "+55" },
  { name: "British Indian Ocean Territory", iso2: "IO", dialCode: "+246" },
  { name: "Brunei", iso2: "BN", dialCode: "+673" },
  { name: "Bulgaria", iso2: "BG", dialCode: "+359" },
  { name: "Burkina Faso", iso2: "BF", dialCode: "+226" },
  { name: "Burundi", iso2: "BI", dialCode: "+257" },
  { name: "Cambodia", iso2: "KH", dialCode: "+855" },
  { name: "Cameroon", iso2: "CM", dialCode: "+237" },
  { name: "Cape Verde", iso2: "CV", dialCode: "+238" },
  { name: "Cayman Islands", iso2: "KY", dialCode: "+1345" },
  { name: "Central African Republic", iso2: "CF", dialCode: "+236" },
  { name: "Chad", iso2: "TD", dialCode: "+235" },
  { name: "Chile", iso2: "CL", dialCode: "+56" },
  { name: "China", iso2: "CN", dialCode: "+86" },
  { name: "Christmas Island", iso2: "CX", dialCode: "+61" },
  { name: "Cocos (Keeling) Islands", iso2: "CC", dialCode: "+61" },
  { name: "Colombia", iso2: "CO", dialCode: "+57" },
  { name: "Comoros", iso2: "KM", dialCode: "+269" },
  { name: "Cook Islands", iso2: "CK", dialCode: "+682" },
  { name: "Costa Rica", iso2: "CR", dialCode: "+506" },
  { name: "Croatia", iso2: "HR", dialCode: "+385" },
  { name: "Cuba", iso2: "CU", dialCode: "+53" },
  { name: "Cyprus", iso2: "CY", dialCode: "+357" },
  { name: "Czech Republic", iso2: "CZ", dialCode: "+420" },
  { name: "Democratic Republic of the Congo", iso2: "CD", dialCode: "+243" },
  { name: "Denmark", iso2: "DK", dialCode: "+45" },
  { name: "Djibouti", iso2: "DJ", dialCode: "+253" },
  { name: "Dominica", iso2: "DM", dialCode: "+1767" },
  { name: "Dominican Republic", iso2: "DO", dialCode: "+1809" },
  { name: "East Timor", iso2: "TL", dialCode: "+670" },
  { name: "Ecuador", iso2: "EC", dialCode: "+593" },
  { name: "Egypt", iso2: "EG", dialCode: "+20" },
  { name: "El Salvador", iso2: "SV", dialCode: "+503" },
  { name: "Equatorial Guinea", iso2: "GQ", dialCode: "+240" },
  { name: "Eritrea", iso2: "ER", dialCode: "+291" },
  { name: "Estonia", iso2: "EE", dialCode: "+372" },
  { name: "Ethiopia", iso2: "ET", dialCode: "+251" },
  { name: "Falkland Islands", iso2: "FK", dialCode: "+500" },
  { name: "Faroe Islands", iso2: "FO", dialCode: "+298" },
  { name: "Federated States of Micronesia", iso2: "FM", dialCode: "+691" },
  { name: "Fiji", iso2: "FJ", dialCode: "+679" },
  { name: "Finland", iso2: "FI", dialCode: "+358" },
  { name: "French Guiana", iso2: "GF", dialCode: "+594" },
  { name: "French Polynesia", iso2: "PF", dialCode: "+689" },
  { name: "Gabon", iso2: "GA", dialCode: "+241" },
  { name: "Georgia", iso2: "GE", dialCode: "+995" },
  { name: "Ghana", iso2: "GH", dialCode: "+233" },
  { name: "Gibraltar", iso2: "GI", dialCode: "+350" },
  { name: "Greece", iso2: "GR", dialCode: "+30" },
  { name: "Greenland", iso2: "GL", dialCode: "+299" },
  { name: "Grenada", iso2: "GD", dialCode: "+1473" },
  { name: "Guadeloupe", iso2: "GP", dialCode: "+590" },
  { name: "Guam", iso2: "GU", dialCode: "+1671" },
  { name: "Guatemala", iso2: "GT", dialCode: "+502" },
  { name: "Guernsey", iso2: "GG", dialCode: "+44" },
  { name: "Guinea", iso2: "GN", dialCode: "+224" },
  { name: "Guinea-Bissau", iso2: "GW", dialCode: "+245" },
  { name: "Guyana", iso2: "GY", dialCode: "+592" },
  { name: "Haiti", iso2: "HT", dialCode: "+509" },
  { name: "Honduras", iso2: "HN", dialCode: "+504" },
  { name: "Hong Kong", iso2: "HK", dialCode: "+852" },
  { name: "Hungary", iso2: "HU", dialCode: "+36" },
  { name: "Iceland", iso2: "IS", dialCode: "+354" },
  { name: "Indonesia", iso2: "ID", dialCode: "+62" },
  { name: "Iran", iso2: "IR", dialCode: "+98" },
  { name: "Iraq", iso2: "IQ", dialCode: "+964" },
  { name: "Ireland", iso2: "IE", dialCode: "+353" },
  { name: "Isle of Man", iso2: "IM", dialCode: "+44" },
  { name: "Israel", iso2: "IL", dialCode: "+972" },
  { name: "Ivory Coast", iso2: "CI", dialCode: "+225" },
  { name: "Jamaica", iso2: "JM", dialCode: "+1876" },
  { name: "Japan", iso2: "JP", dialCode: "+81" },
  { name: "Jersey", iso2: "JE", dialCode: "+44" },
  { name: "Jordan", iso2: "JO", dialCode: "+962" },
  { name: "Kazakhstan", iso2: "KZ", dialCode: "+76" },
  { name: "Kenya", iso2: "KE", dialCode: "+254" },
  { name: "Kiribati", iso2: "KI", dialCode: "+686" },
  { name: "Kuwait", iso2: "KW", dialCode: "+965" },
  { name: "Kyrgyzstan", iso2: "KG", dialCode: "+996" },
  { name: "Laos", iso2: "LA", dialCode: "+856" },
  { name: "Latvia", iso2: "LV", dialCode: "+371" },
  { name: "Lebanon", iso2: "LB", dialCode: "+961" },
  { name: "Lesotho", iso2: "LS", dialCode: "+266" },
  { name: "Liberia", iso2: "LR", dialCode: "+231" },
  { name: "Libya", iso2: "LY", dialCode: "+218" },
  { name: "Liechtenstein", iso2: "LI", dialCode: "+423" },
  { name: "Lithuania", iso2: "LT", dialCode: "+370" },
  { name: "Luxembourg", iso2: "LU", dialCode: "+352" },
  { name: "Macau", iso2: "MO", dialCode: "+853" },
  { name: "Madagascar", iso2: "MG", dialCode: "+261" },
  { name: "Malawi", iso2: "MW", dialCode: "+265" },
  { name: "Malaysia", iso2: "MY", dialCode: "+60" },
  { name: "Maldives", iso2: "MV", dialCode: "+960" },
  { name: "Mali", iso2: "ML", dialCode: "+223" },
  { name: "Malta", iso2: "MT", dialCode: "+356" },
  { name: "Marshall Islands", iso2: "MH", dialCode: "+692" },
  { name: "Martinique", iso2: "MQ", dialCode: "+596" },
  { name: "Mauritania", iso2: "MR", dialCode: "+222" },
  { name: "Mauritius", iso2: "MU", dialCode: "+230" },
  { name: "Mayotte", iso2: "YT", dialCode: "+262" },
  { name: "Mexico", iso2: "MX", dialCode: "+52" },
  { name: "Moldova", iso2: "MD", dialCode: "+373" },
  { name: "Monaco", iso2: "MC", dialCode: "+377" },
  { name: "Mongolia", iso2: "MN", dialCode: "+976" },
  { name: "Montserrat", iso2: "MS", dialCode: "+1664" },
  { name: "Morocco", iso2: "MA", dialCode: "+212" },
  { name: "Mozambique", iso2: "MZ", dialCode: "+258" },
  { name: "Namibia", iso2: "NA", dialCode: "+264" },
  { name: "Nauru", iso2: "NR", dialCode: "+674" },
  { name: "Nepal", iso2: "NP", dialCode: "+977" },
  { name: "New Caledonia", iso2: "NC", dialCode: "+687" },
  { name: "Nicaragua", iso2: "NI", dialCode: "+505" },
  { name: "Niger", iso2: "NE", dialCode: "+227" },
  { name: "Nigeria", iso2: "NG", dialCode: "+234" },
  { name: "Niue", iso2: "NU", dialCode: "+683" },
  { name: "Norfolk Island", iso2: "NF", dialCode: "+672" },
  { name: "North Korea", iso2: "KP", dialCode: "+850" },
  { name: "Northern Mariana Islands", iso2: "MP", dialCode: "+1670" },
  { name: "Norway", iso2: "NO", dialCode: "+47" },
  { name: "Oman", iso2: "OM", dialCode: "+968" },
  { name: "Pakistan", iso2: "PK", dialCode: "+92" },
  { name: "Palau", iso2: "PW", dialCode: "+680" },
  { name: "Panama", iso2: "PA", dialCode: "+507" },
  { name: "Papua New Guinea", iso2: "PG", dialCode: "+675" },
  { name: "Paraguay", iso2: "PY", dialCode: "+595" },
  { name: "Peru", iso2: "PE", dialCode: "+51" },
  { name: "Philippines", iso2: "PH", dialCode: "+63" },
  { name: "Pitcairn Islands", iso2: "PN", dialCode: "+64" },
  { name: "Poland", iso2: "PL", dialCode: "+48" },
  { name: "Portugal", iso2: "PT", dialCode: "+351" },
  { name: "Puerto Rico", iso2: "PR", dialCode: "+1787" },
  { name: "Qatar", iso2: "QA", dialCode: "+974" },
  { name: "Republic of Macedonia", iso2: "MK", dialCode: "+389" },
  { name: "Republic of the Congo", iso2: "CG", dialCode: "+242" },
  { name: "Romania", iso2: "RO", dialCode: "+40" },
  { name: "Russia", iso2: "RU", dialCode: "+7" },
  { name: "Rwanda", iso2: "RW", dialCode: "+250" },
  { name: "Réunion", iso2: "RE", dialCode: "+262" },
  { name: "Saint Helena", iso2: "SH", dialCode: "+290" },
  { name: "Saint Kitts and Nevis", iso2: "KN", dialCode: "+1869" },
  { name: "Saint Lucia", iso2: "LC", dialCode: "+1758" },
  { name: "Saint Pierre and Miquelon", iso2: "PM", dialCode: "+508" },
  { name: "Saint Vincent and the Grenadines", iso2: "VC", dialCode: "+1784" },
  { name: "Samoa", iso2: "WS", dialCode: "+685" },
  { name: "San Marino", iso2: "SM", dialCode: "+378" },
  { name: "Senegal", iso2: "SN", dialCode: "+221" },
  { name: "Serbia", iso2: "RS", dialCode: "+381" },
  { name: "Seychelles", iso2: "SC", dialCode: "+248" },
  { name: "Sierra Leone", iso2: "SL", dialCode: "+232" },
  { name: "Slovakia", iso2: "SK", dialCode: "+421" },
  { name: "Slovenia", iso2: "SI", dialCode: "+386" },
  { name: "Solomon Islands", iso2: "SB", dialCode: "+677" },
  { name: "Somalia", iso2: "SO", dialCode: "+252" },
  { name: "South Africa", iso2: "ZA", dialCode: "+27" },
  { name: "South Georgia", iso2: "GS", dialCode: "+500" },
  { name: "South Korea", iso2: "KR", dialCode: "+82" },
  { name: "South Sudan", iso2: "SS", dialCode: "+211" },
  { name: "Sri Lanka", iso2: "LK", dialCode: "+94" },
  { name: "Sudan", iso2: "SD", dialCode: "+249" },
  { name: "Suriname", iso2: "SR", dialCode: "+597" },
  { name: "Svalbard and Jan Mayen", iso2: "SJ", dialCode: "+4779" },
  { name: "Swaziland", iso2: "SZ", dialCode: "+268" },
  { name: "Sweden", iso2: "SE", dialCode: "+46" },
  { name: "Switzerland", iso2: "CH", dialCode: "+41" },
  { name: "Syria", iso2: "SY", dialCode: "+963" },
  { name: "São Tomé and Príncipe", iso2: "ST", dialCode: "+239" },
  { name: "Taiwan", iso2: "TW", dialCode: "+886" },
  { name: "Tajikistan", iso2: "TJ", dialCode: "+992" },
  { name: "Tanzania", iso2: "TZ", dialCode: "+255" },
  { name: "Thailand", iso2: "TH", dialCode: "+66" },
  { name: "The Bahamas", iso2: "BS", dialCode: "+1242" },
  { name: "The Gambia", iso2: "GM", dialCode: "+220" },
  { name: "Togo", iso2: "TG", dialCode: "+228" },
  { name: "Tokelau", iso2: "TK", dialCode: "+690" },
  { name: "Tonga", iso2: "TO", dialCode: "+676" },
  { name: "Trinidad and Tobago", iso2: "TT", dialCode: "+1868" },
  { name: "Tunisia", iso2: "TN", dialCode: "+216" },
  { name: "Turkey", iso2: "TR", dialCode: "+90" },
  { name: "Turkmenistan", iso2: "TM", dialCode: "+993" },
  { name: "Tuvalu", iso2: "TV", dialCode: "+688" },
  { name: "Uganda", iso2: "UG", dialCode: "+256" },
  { name: "Ukraine", iso2: "UA", dialCode: "+380" },
  { name: "Uruguay", iso2: "UY", dialCode: "+598" },
  { name: "Uzbekistan", iso2: "UZ", dialCode: "+998" },
  { name: "Vanuatu", iso2: "VU", dialCode: "+678" },
  { name: "Venezuela", iso2: "VE", dialCode: "+58" },
  { name: "Vietnam", iso2: "VN", dialCode: "+84" },
  { name: "Wallis and Futuna", iso2: "WF", dialCode: "+681" },
  { name: "Western Sahara", iso2: "EH", dialCode: "+212" },
  { name: "Yemen", iso2: "YE", dialCode: "+967" },
  { name: "Zambia", iso2: "ZM", dialCode: "+260" },
  { name: "Zimbabwe", iso2: "ZW", dialCode: "+263" },
];

function flagEmoji(iso2: string) {
  return iso2
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("");
}

function PhoneInput({
  value,
  onChange,
  invalid,
}: {
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
}) {
  const defaultCountry = phoneCountries.find((country) => country.iso2 === "GB") ?? phoneCountries[0];
  const [selectedCountry, setSelectedCountry] = useState<PhoneCountry>(defaultCountry);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const nationalNumber = value.startsWith(selectedCountry.dialCode)
    ? value.slice(selectedCountry.dialCode.length).trimStart()
    : value;

  const filteredCountries = phoneCountries.filter((country) => {
    const search = query.trim().toLowerCase();
    if (!search) return true;
    return (
      country.name.toLowerCase().includes(search) ||
      country.iso2.toLowerCase().includes(search) ||
      country.dialCode.includes(search)
    );
  });

  const chooseCountry = (country: PhoneCountry) => {
    setSelectedCountry(country);
    setOpen(false);
    setQuery("");
    onChange(nationalNumber ? `${country.dialCode} ${nationalNumber}` : "");
  };

  const updateNumber = (nextValue: string) => {
    const cleaned = nextValue.replace(/[^0-9\s().-]/g, "");
    onChange(cleaned.trim() ? `${selectedCountry.dialCode} ${cleaned.trimStart()}` : "");
  };

  return (
    <div
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
          setQuery("");
        }
      }}
    >
      <div
        className={`flex h-12 w-full overflow-visible rounded-xl border bg-white text-sm text-slate-900 transition focus-within:ring-4 focus-within:ring-accent/10 ${
          invalid ? "border-red-400" : "border-slate-200 focus-within:border-accent"
        }`}
      >
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="inline-flex shrink-0 items-center gap-2 rounded-l-xl border-r border-slate-200 px-3 text-slate-700 outline-none hover:bg-slate-50 focus:bg-slate-50"
          aria-label="Select phone country code"
          aria-expanded={open}
        >
          <span className="text-lg leading-none" aria-hidden="true">
            {flagEmoji(selectedCountry.iso2)}
          </span>
          <span className="text-xs font-bold">{selectedCountry.dialCode}</span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>

        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          value={nationalNumber}
          onChange={(event) => updateNumber(event.target.value)}
          className="min-w-0 flex-1 rounded-r-xl bg-transparent px-3 outline-none placeholder:text-slate-400"
          placeholder="Phone number"
          aria-label="Phone or WhatsApp number"
        />
      </div>

      {open && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full min-w-[300px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="border-b border-slate-100 p-2">
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
              placeholder="Search country or code"
              aria-label="Search phone country code"
            />
          </div>

          <div className="max-h-64 overflow-y-auto p-1">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={`${country.iso2}-${country.dialCode}`}
                  type="button"
                  onClick={() => chooseCountry(country)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
                >
                  <span className="text-lg leading-none" aria-hidden="true">
                    {flagEmoji(country.iso2)}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm text-slate-700">{country.name}</span>
                  <span className="text-xs font-bold text-slate-500">{country.dialCode}</span>
                </button>
              ))
            ) : (
              <p className="px-3 py-5 text-center text-xs text-slate-500">No countries found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const fieldClass =
  "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10";
const labelClass = "mb-2 block text-xs font-bold text-slate-600";
const errorClass = "mt-1.5 text-xs font-semibold text-red-600";

function SelectField({
  value,
  onChange,
  placeholder,
  options,
  invalid,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: string[];
  invalid?: boolean;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${fieldClass} appearance-none pr-10 ${invalid ? "border-red-400" : ""}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
    </div>
  );
}

export function WholesaleApplicationForm() {
  const { wholesaleApply } = useAuth();
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const setField = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const validate = () => {
    const next: Errors = {};
    if (!values.fullName.trim()) next.fullName = "Full name is required.";
    if (!values.businessName.trim()) next.businessName = "Business / institution is required.";
    if (!values.email.trim()) next.email = "Business email is required.";
    else if (!isEmail(values.email)) next.email = "Enter a valid email address.";
    if (values.phone.trim() && !isPhone(values.phone)) next.phone = "Enter a valid phone number.";
    if (!values.country) next.country = "Select the country of registration.";
    if (!values.businessType) next.businessType = "Select a business type.";
    if (!values.supplyFormat) next.supplyFormat = "Select a supply format.";
    if (!values.estimatedMonthlyPurchasing)
      next.estimatedMonthlyPurchasing = "Select an expected purchasing volume.";
    if (!values.productsOfInterest) next.productsOfInterest = "Select products of interest.";
    if (!values.password || values.password.length < 8)
      next.password = "Password must be at least 8 characters.";
    if (values.password !== values.confirmPassword)
      next.confirmPassword = "Passwords do not match.";
    if (!values.confirmation) next.confirmation = "Please confirm this is a legitimate business enquiry.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await wholesaleApply({
        email: values.email,
        password: values.password,
        requestedRole: "wholesaler",
        fullName: values.fullName,
        businessName: values.businessName,
        phone: values.phone || undefined,
        country: values.country,
        businessType: values.businessType,
        supplyFormat: values.supplyFormat,
        estimatedMonthlyPurchasing: values.estimatedMonthlyPurchasing,
        productsOfInterest: values.productsOfInterest,
        additionalRequirements: values.additionalRequirements || undefined,
        businessEnquiryConfirmed: values.confirmation,
      });
      setSent(true);
    } catch (error) {
      setSubmitError(
        error instanceof ApiError ? error.message : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="flex min-h-[520px] flex-col items-center justify-center px-6 py-16 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-accent/10 text-accent">
          <Check className="h-8 w-8" />
        </div>
        <h2 className="mt-6 text-2xl font-black text-primary">Enquiry received</h2>
        <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
          Your ONYX account has been created and your wholesale application is now pending review.
          You can sign in with the email and password you just created while our B2B team reviews your application.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
            ONYX B2B Application
          </p>
          <h2 className="mt-2 text-xl font-black tracking-tight text-primary md:text-2xl">
            Tell us about your requirements
          </h2>
        </div>
        <span className="rounded-full bg-sky-50 px-3 py-1.5 text-[11px] font-bold text-accent">
          Confidential enquiry
        </span>
      </div>

      <div className="mt-6 grid gap-x-5 gap-y-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Full name *</label>
          <input
            value={values.fullName}
            onChange={(e) => setField("fullName", e.target.value)}
            className={`${fieldClass} ${errors.fullName ? "border-red-400" : ""}`}
            placeholder="Your full name"
          />
          {errors.fullName && <p className={errorClass}>{errors.fullName}</p>}
        </div>
        <div>
          <label className={labelClass}>Business / institution *</label>
          <input
            value={values.businessName}
            onChange={(e) => setField("businessName", e.target.value)}
            className={`${fieldClass} ${errors.businessName ? "border-red-400" : ""}`}
            placeholder="Registered or trading name"
          />
          {errors.businessName && <p className={errorClass}>{errors.businessName}</p>}
        </div>

        <div>
          <label className={labelClass}>Business email *</label>
          <input
            type="email"
            value={values.email}
            onChange={(e) => setField("email", e.target.value)}
            className={`${fieldClass} ${errors.email ? "border-red-400" : ""}`}
            placeholder="name@company.com"
          />
          {errors.email && <p className={errorClass}>{errors.email}</p>}
        </div>
        <div>
          <label className={labelClass}>Phone / WhatsApp</label>
          <PhoneInput
            value={values.phone}
            onChange={(value) => setField("phone", value)}
            invalid={!!errors.phone}
          />
          {errors.phone && <p className={errorClass}>{errors.phone}</p>}
        </div>

        <div>
          <label className={labelClass}>Country of registration *</label>
          <div className={errors.country ? "rounded-xl ring-1 ring-red-400" : ""}>
            <CountrySelect
              value={values.country}
              onChange={(value) => setField("country", value)}
              invalid={!!errors.country}
            />
          </div>
          {errors.country && <p className={errorClass}>{errors.country}</p>}
        </div>
        <div>
          <label className={labelClass}>Business type *</label>
          <SelectField
            value={values.businessType}
            onChange={(value) => setField("businessType", value)}
            placeholder="Select business type"
            options={businessTypes}
            invalid={!!errors.businessType}
          />
          {errors.businessType && <p className={errorClass}>{errors.businessType}</p>}
        </div>
<div>
          <label className={labelClass}>Supply format required *</label>
          <SelectField
            value={values.supplyFormat}
            onChange={(value) => setField("supplyFormat", value)}
            placeholder="Select supply format"
            options={supplyFormats}
            invalid={!!errors.supplyFormat}
          />
          {errors.supplyFormat && <p className={errorClass}>{errors.supplyFormat}</p>}
        </div>
        <div>
          <label className={labelClass}>Estimated monthly purchasing *</label>
          <SelectField
            value={values.estimatedMonthlyPurchasing}
            onChange={(value) => setField("estimatedMonthlyPurchasing", value)}
            placeholder="Select expected volume"
            options={purchasingVolumes}
            invalid={!!errors.estimatedMonthlyPurchasing}
          />
          {errors.estimatedMonthlyPurchasing && (
            <p className={errorClass}>{errors.estimatedMonthlyPurchasing}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Products of interest *</label>
          <SelectField
            value={values.productsOfInterest}
            onChange={(value) => setField("productsOfInterest", value)}
            placeholder="Select products of interest"
            options={productOptions}
            invalid={!!errors.productsOfInterest}
          />
          {errors.productsOfInterest && <p className={errorClass}>{errors.productsOfInterest}</p>}
        </div>
<div>
          <label className={labelClass}>Create password *</label>
          <input
            type="password"
            autoComplete="new-password"
            value={values.password}
            onChange={(e) => setField("password", e.target.value)}
            className={`${fieldClass} ${errors.password ? "border-red-400" : ""}`}
            placeholder="Minimum 8 characters"
          />
          {errors.password && <p className={errorClass}>{errors.password}</p>}
        </div>
        <div>
          <label className={labelClass}>Confirm password *</label>
          <input
            type="password"
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={(e) => setField("confirmPassword", e.target.value)}
            className={`${fieldClass} ${errors.confirmPassword ? "border-red-400" : ""}`}
            placeholder="Re-enter your password"
          />
          {errors.confirmPassword && <p className={errorClass}>{errors.confirmPassword}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Additional requirements</label>
          <textarea
            rows={4}
            value={values.additionalRequirements}
            onChange={(e) => setField("additionalRequirements", e.target.value)}
            className={`${fieldClass} h-auto min-h-28 py-3`}
            placeholder="Preferred products, strengths, packaging, launch date or other requirements."
          />
        </div>
      </div>

      <label
        className={`mt-5 flex cursor-pointer items-start gap-3 rounded-xl border bg-sky-50/60 p-4 text-xs leading-5 text-slate-600 ${errors.confirmation ? "border-red-300" : "border-sky-100"}`}
      >
        <input
          type="checkbox"
          checked={values.confirmation}
          onChange={(e) => setField("confirmation", e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-slate-300 accent-blue-600"
        />
        <span>
          I confirm this enquiry is made for a legitimate business or professional organisation and
          that the information provided is accurate.
          {errors.confirmation && <span className="mt-1 block font-semibold text-red-600">{errors.confirmation}</span>}
        </span>
      </label>

      {submitError && <p className="mt-4 text-sm font-semibold text-red-600">{submitError}</p>}

      <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-end sm:justify-between">
        <p className="max-w-md text-[11px] leading-5 text-slate-400">
          Trade pricing is released privately after business and volume review. Submission does not
          guarantee account approval.
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-accent/20 transition hover:-translate-y-0.5 hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Create account & submit application"}
          {!submitting && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
        </button>
      </div>
    </form>
  );
}

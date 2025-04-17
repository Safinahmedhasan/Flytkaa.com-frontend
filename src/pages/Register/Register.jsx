import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { BiError } from "react-icons/bi";
import { FiAlertTriangle, FiMail, FiLock, FiUser, FiGlobe, FiGift } from "react-icons/fi";
import AnimatedSuccessMessage from "./AnimatedSuccessMessage";

// Country list remains the same
const countryList = [
  "Select your country",
  "Afghanistan",
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
  "Democratic Republic of the Congo",
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
  "Eswatini",
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
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
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
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
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
  "Solomon Islands",
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
];

const ErrorMessage = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="bg-red-50 rounded-xl p-4 flex items-center gap-3 border border-red-100"
  >
    <BiError className="text-red-500 text-xl flex-shrink-0" />
    <p className="text-red-500 text-sm">{message}</p>
  </motion.div>
);

const ValidationMessage = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex items-center gap-2 mt-1 ml-2"
  >
    <FiAlertTriangle className="text-red-400 text-xs" />
    <p className="text-red-400 text-xs">{message}</p>
  </motion.div>
);

const InputField = ({ icon: Icon, error, ...props }) => (
  <motion.div whileTap={{ scale: 0.995 }} className="relative group">
    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
      <Icon className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
    </div>
    <input
      {...props}
      className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-xl outline-none text-gray-700 placeholder-gray-400
        transition-all duration-300 ${
          error
            ? "border-red-200 focus:border-red-500"
            : "border-gray-200 focus:border-blue-500"
        } focus:bg-white`}
    />
  </motion.div>
);

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    invitationCode: "",
    agreedToTerms: false,
    selectedCountry: "",
    fullName: "",
  });

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_DataHost;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const referralCode = params.get("referralCode");
    if (referralCode) {
      setFormData(prev => ({ ...prev, invitationCode: referralCode }));
    }
  }, [location]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.selectedCountry || formData.selectedCountry === "Select your country") {
      newErrors.country = "Please select your country";
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters";
    }

    if (!formData.agreedToTerms) {
      newErrors.terms = "You must agree to the terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setGeneralError("");

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          referralCode: formData.invitationCode,
          country: formData.selectedCountry,
          fullName: formData.fullName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      localStorage.setItem("token", data.token);
      setShowSuccess(true);
    } catch (error) {
      setGeneralError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute w-96 h-96 -top-48 -left-48 bg-blue-100 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute w-96 h-96 -bottom-48 -right-48 bg-purple-100 rounded-full blur-3xl"
        />
      </div>

      <AnimatedSuccessMessage
        show={showSuccess}
        onComplete={() => navigate("/login")}
      />

      <div className="w-full max-w-xl p-4 sm:p-6 md:p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-100 shadow-xl"
        >
          {/* Logo or Brand Section */}
          <motion.div 
            className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg"
            whileHover={{ rotate: 5, scale: 1.05 }}
          >
            <span className="text-2xl font-bold text-white">IFC</span>
          </motion.div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">
              Create Account
            </h2>
            <p className="text-gray-500">
              Join ifcprofit.live today
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <AnimatePresence>
              {generalError && <ErrorMessage message={generalError} />}
            </AnimatePresence>

            <div className="space-y-4">
              <InputField
                icon={FiGift}
                type="text"
                name="invitationCode"
                value={formData.invitationCode}
                onChange={handleInputChange}
                placeholder="Invitation code (Optional)"
              />

              <div className="space-y-1">
                <InputField
                  icon={FiMail}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email address"
                  required
                  error={errors.email}
                />
                {errors.email && <ValidationMessage message={errors.email} />}
              </div>

              <div className="space-y-1">
                <InputField
                  icon={FiUser}
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Full name"
                  required
                  error={errors.fullName}
                />
                {errors.fullName && <ValidationMessage message={errors.fullName} />}
              </div>

              <div className="space-y-1">
                <motion.div whileTap={{ scale: 0.995 }} className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <FiGlobe className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <select
                    name="selectedCountry"
                    value={formData.selectedCountry}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-xl outline-none text-gray-700
                      transition-all duration-300 appearance-none ${
                        errors.country
                          ? "border-red-200 focus:border-red-500"
                          : "border-gray-200 focus:border-blue-500"
                      } focus:bg-white`}
                    required
                  >
                    {countryList.map((country, index) => (
                      <option key={index} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </motion.div>
                {errors.country && <ValidationMessage message={errors.country} />}
              </div>

              <div className="space-y-1">
                <InputField
                  icon={FiLock}
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  required
                  error={errors.password}
                />
                {errors.password && <ValidationMessage message={errors.password} />}
              </div>

              <div className="space-y-1">
                <InputField
                  icon={FiLock}
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm password"
                  required
                  error={errors.confirmPassword}
                />
                {errors.confirmPassword && (
                  <ValidationMessage message={errors.confirmPassword} />
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onChange={handleInputChange}
                  className={`w-4 h-4 rounded border-2 text-blue-500 focus:ring-blue-500 ${
                    errors.terms ? "border-red-300" : "border-gray-300"
                  }`}
                  required
                />
                <label className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-blue-500 hover:text-blue-600 underline"
                  >
                    terms and conditions
                  </Link>
                </label>
              </div>
              {errors.terms && <ValidationMessage message={errors.terms} />}
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold 
                rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25
                disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Creating account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </motion.button>

            <p className="text-center text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-500 hover:text-blue-600 transition-colors font-medium"
              >
                Sign in
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
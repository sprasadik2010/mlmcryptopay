import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function SignupPage() {
  const navigate = useNavigate();
  const { encodedData } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
    nationality: "",
    agreeToPolicy: false,
    position: "Left",
  });

  const [showPolicy, setShowPolicy] = useState(false);
  const [error, setError] = useState("");

  // Decode referralCode and position from Base64
  useEffect(() => {
    if (encodedData) {
      try {
        const decodedString = atob(encodedData); // Decode Base64
        const [referralCode, position] = decodedString.split("|");

        if (!referralCode || !position) {
          navigate("/"); // Redirect to home if invalid data
        }

        setFormData((prev) => ({
          ...prev,
          referralCode,
          position: position === "Right" ? "Right" : "Left",
        }));
      } catch (error) {
        navigate("/"); // Redirect if decoding fails
      }
    }
  }, [encodedData, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!formData.referralCode || !formData.nationality || !formData.email) {
      setError("All fields are required!");
      return;
    }

    setError("");
    console.log("Signup successful:", formData);

    navigate("/auth/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-blue-600">Sign Up</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Referral Code (Non-editable) */}
          <div className="opacity-50">
            <label className="block text-sm font-medium text-gray-600">Referral Code</label>
            <input
              type="text"
              name="referralCode"
              value={formData.referralCode}
              readOnly
              className="w-full px-4 py-2 mt-1 border rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Position (Non-editable switch) */}
          <div className="opacity-50">
            <label className="block text-sm font-medium text-gray-600">Position</label>
            <div className="flex items-center bg-gray-200 rounded-lg p-1">
              <div
                className={`w-1/2 text-center py-1 rounded-lg transition-colors duration-200 ${
                  formData.position === "Left" ? "bg-blue-600 text-white" : "bg-transparent"
                }`}
              >
                Left
              </div>
              <div
                className={`w-1/2 text-center py-1 rounded-lg transition-colors duration-200 ${
                  formData.position === "Right" ? "bg-blue-600 text-white" : "bg-transparent"
                }`}
              >
                Right
              </div>
            </div>
          </div>

          {/* Nationality */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Nationality</label>
            <select
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            >
              <option value="">Select Nationality</option>
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Privacy Policy Agreement */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="agreeToPolicy"
              checked={formData.agreeToPolicy}
              onChange={handleChange}
              className="w-5 h-5 mr-2"
              required
            />
            <label className="text-sm text-gray-600">
              I agree to the{" "}
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => setShowPolicy(true)}
              >
                Privacy Policy
              </button>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full px-4 py-2 font-semibold text-white rounded-lg ${
              formData.agreeToPolicy
                ? "bg-blue-600 hover:bg-blue-500"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!formData.agreeToPolicy}
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

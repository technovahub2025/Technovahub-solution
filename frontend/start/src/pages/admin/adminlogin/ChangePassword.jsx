import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineLock, AiOutlineUser } from "react-icons/ai";
import toast from "react-hot-toast";
import logo from "../../../assets/images/logoremove.png";
import bgImage from "../../../assets/images/bk3.jpg";
import { changeAdminPassword } from "../../../api/authApi";

const ChangePassword = () => {
  const [userName, setUserName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visible, setVisible] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggle = (field) => setVisible((state) => ({ ...state, [field]: !state[field] }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!newPassword || !confirmPassword || !currentPassword) {
      toast.error("All password fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }
    if (new TextEncoder().encode(newPassword).length > 72) {
      toast.error("New password must be 72 UTF-8 bytes or fewer.");
      return;
    }

    setLoading(true);
    try {
      const result = await changeAdminPassword(userName, currentPassword, newPassword, confirmPassword);
      toast.success(result.message || "Password updated successfully.");
      navigate("/adminlogin", { replace: true });
    } catch (error) {
      toast.error(error.message || "Unable to update password.");
    } finally {
      setLoading(false);
    }
  };

  const passwordField = (name, label, value, setter) => (
    <div className="relative">
      <AiOutlineLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      <input
        type={visible[name] ? "text" : "password"}
        value={value}
        onChange={(event) => setter(event.target.value)}
        placeholder={label}
        autoComplete="new-password"
        className="mt-1 block rounded-md text-white w-full pl-10 pr-11 px-3 py-2 border border-white focus:outline-none focus:ring focus:border-blue-500 placeholder:text-white/70"
        required
      />
      <button type="button" onClick={() => toggle(name)} aria-label={`${visible[name] ? "Hide" : "Show"} ${label.toLowerCase()}`} className="absolute inset-y-0 right-0 px-3 flex items-center text-white">
        {visible[name] ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
      </button>
    </div>
  );

  return (
    <div className="flex justify-center md:items-center p-2 min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="w-full max-w-xl md:p-10 p-8 bg-white/10 backdrop-blur-md md:shadow-lg shadow-xl mt-6 mb-6 rounded-[50px]">
        <div className="flex justify-center">
          <img src={logo} alt="TechnovaHub Logo" className="rounded-full w-[200px] h-[150px] md:w-[290px] md:h-[250px]" />
        </div>
        <h2 className="text-xl font-extrabold text-center mb-6">Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <AiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" value={userName} onChange={(event) => setUserName(event.target.value.toLowerCase())} placeholder="Enter admin username" autoComplete="username" className="mt-1 block text-white rounded-md w-full pl-10 px-3 py-2 border border-white focus:outline-none focus:ring focus:border-blue-500 placeholder:text-white/70" required />
          </div>
          {passwordField("current", "Current password", currentPassword, setCurrentPassword)}
          {passwordField("new", "New password", newPassword, setNewPassword)}
          <p className="text-xs text-white/80">For better security, consider using a long, unique password. This is a recommendation, not a requirement.</p>
          {passwordField("confirm", "Confirm new password", confirmPassword, setConfirmPassword)}
          <button type="submit" disabled={loading} className={`w-full mt-3 bg-blue-400 hover:bg-blue-500 text-white py-2 px-4 border-2 border-white rounded transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
            {loading ? "Updating password..." : "Update Password"}
          </button>
          <div className="text-center pt-2">
            <Link to="/adminlogin" className="text-sm text-blue-300 underline hover:text-blue-200">Back to Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;

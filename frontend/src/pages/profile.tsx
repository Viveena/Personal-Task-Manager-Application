import { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import type { AuthContextType } from "../context/AuthContext";
import { toast } from "react-toastify";
import "../css/Profile.css"; // Import the CSS file
import axios from "axios";

interface User {
  _id: string;
  username: string;
  email: string;
}

interface AccountStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
}

const Profile = () => {
  const { user, updateProfile, changePassword } = useContext<AuthContextType>(AuthContext);
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [accountStats, setAccountStats] = useState<AccountStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    if (user) {
      fetchAccountStats();
    }
  }, [user]);

  const fetchAccountStats = async () => {
    setStatsLoading(true);
    try {
      const res = await axios.get<AccountStats>('/api/auth/stats');
      setAccountStats(res.data);
    } catch (err) {
      console.error("Failed to fetch account stats:", err);
      toast.error("❌ Failed to load account statistics.");
    } finally {
      setStatsLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!username.trim()) return toast.error("❌ Username cannot be empty");
    if (!validateEmail(email)) return toast.error("❌ Please enter a valid email");

    setIsUpdatingProfile(true);
    try {
      const success = await updateProfile(username.trim(), email);
      success
        ? toast.success("✅ Profile updated successfully!")
        : toast.error("❌ Failed to update profile. Please try again.");
    } catch {
      toast.error("❌ An error occurred while updating profile");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword) return toast.error("❌ Please enter your current password");
    if (newPassword.length < 6) return toast.error("❌ New password must be at least 6 characters");

    setIsChangingPassword(true);
    try {
      const success = await changePassword(oldPassword, newPassword);
      if (success) {
        toast.success("🔒 Password changed successfully!");
        setOldPassword("");
        setNewPassword("");
      } else {
        toast.error("❌ Failed to change password. Please check your old password.");
      }
    } catch {
      toast.error("❌ An error occurred while changing password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!user)
    return (
      <div className="profile-page">
        <p className="message">Please log in first.</p>
      </div>
    );

  return (
    <div className="profile-page">
      <h1 className="profile-title">User Profile</h1>
      <div className="profile-container">
        {/* Edit Profile */}
        <div className="profile-card">
          <h2>Edit Profile</h2>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
            />
          </div>
          <button onClick={handleProfileUpdate} disabled={isUpdatingProfile}>
            {isUpdatingProfile ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Change Password */}
        <div className="profile-card">
          <h2>Change Password</h2>
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min 6 chars)"
            />
          </div>
          <button onClick={handleChangePassword} disabled={isChangingPassword}>
            {isChangingPassword ? "Updating..." : "Update Password"}
          </button>
        </div>
        {/* New Account Statistics Card */}
        <div className="profile-card account-stats-card">
          <h2>Account Statistics</h2>
          {statsLoading ? (
            <p>Loading stats...</p>
          ) : accountStats ? (
            <div className="stats-grid">
              <div className="stat-item">
                <h3>{accountStats.totalTasks}</h3>
                <p>Total Tasks</p>
              </div>
              <div className="stat-item">
                <h3>{accountStats.completedTasks}</h3>
                <p>Completed Tasks</p>
              </div>
              <div className="stat-item">
                <h3>{accountStats.pendingTasks}</h3>
                <p>Pending Tasks</p>
              </div>
            </div>
          ) : (
            <p>No statistics available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

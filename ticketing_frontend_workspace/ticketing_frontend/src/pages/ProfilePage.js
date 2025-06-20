import React, { useEffect, useState } from "react";
import { fetchUserProfile } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import UserProfile from "../components/UserProfile";

// PUBLIC_INTERFACE
function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!user) return;
    fetchUserProfile()
      .then(setProfile)
      .catch(() => setProfile(user));
  }, [user]);

  if (!user) return <div style={{padding:34}}>Please log in to view your profile.</div>;
  return <UserProfile user={profile} />;
}

export default ProfilePage;

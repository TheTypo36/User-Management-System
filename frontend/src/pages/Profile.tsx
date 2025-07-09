import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    navigate("/signIn");
  }
  return (
    <div>
      <div>
        <h1>{user?.role}</h1>
      </div>
      <div>
        <img src={user?.avatar ? user?.avatar : "./avatar.webp"} />
        <h1>{user?.username}</h1>
        <h1>email: {user?.email}</h1>
      </div>
    </div>
  );
};

export default Profile;

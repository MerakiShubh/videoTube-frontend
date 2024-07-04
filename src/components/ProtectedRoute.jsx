import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const accessToken = useSelector((state) => state.user.accessToken);

  if (!accessToken) {
    // Redirect to SignIn page if not authenticated
    return <Navigate to="/signin" replace />;
  }

  // Otherwise, render the child component
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;

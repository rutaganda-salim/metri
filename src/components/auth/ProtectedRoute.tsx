
import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  session: any;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, session }) => {
  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

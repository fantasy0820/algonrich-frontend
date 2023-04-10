import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "context/AuthContext";

const Logout = () => {
  const { logout } = useAuth();

  const navigate = useNavigate();
  const redirectPath = "/";

  logout();
  navigate(redirectPath, { replace: true });

  return <></>;
};

export default Logout;

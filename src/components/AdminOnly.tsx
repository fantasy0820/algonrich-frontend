import React, { useState, useEffect } from "react";

interface Props {
  children: React.ReactNode;
}

const AdminOnly: React.FC<Props> = ({ children }: Props) => {
  if (localStorage.getItem("useremail") === "admin@algonrich.com") {
    return <>{children}</>;
  }

  return null; // in case the user isn't the admin, don't render anything
};

export default AdminOnly;

import React, { useState, useEffect } from "react";
import SideBar from "../SideBar";
import SearchBar from "../SearchBar";

interface SidebarSizingProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function SidebarSizing(props: SidebarSizingProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {!isSidebarOpen && <></>}
      {isSidebarOpen && <SideBar isSidebarOpen={isSidebarOpen} />}
      <SearchBar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
    </>
  );
}

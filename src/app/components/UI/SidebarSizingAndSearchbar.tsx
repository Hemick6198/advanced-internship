import React, { useEffect } from "react";
import SideBar from "../SideBar";
import SearchBar from "../SearchBar";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { setIsSidebarOpen } from "../../utilities/sidebarSlice";

export default function SidebarSizing() {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector(
    (state: RootState) => state.sidebar.isSidebarOpen
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        dispatch(setIsSidebarOpen(true));
      } else {
        dispatch(setIsSidebarOpen(false));
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
      {isSidebarOpen && <SideBar />}
      <SearchBar />
    </>
  );
}

import { useEffect } from "react";
import Modal from "react-modal";
import Sidebar from "./Sidebar";
import FooterAdmin from "./FooterAdmin";
import NavbarAdmin from "./NavbarAdmin";

export default function LayoutAdmin({ children }) {
  useEffect(() => {
    Modal.setAppElement(document.body);
  }, []);

  return (
    <div>
      <Sidebar />
      <NavbarAdmin />
      {children}
      <FooterAdmin />
    </div>
  );
}

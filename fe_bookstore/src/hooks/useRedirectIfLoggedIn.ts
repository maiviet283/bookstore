import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useRedirectIfLoggedIn() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);
}

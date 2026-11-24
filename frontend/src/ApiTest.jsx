import { useEffect, useState } from "react";

function ApiTest() {
  const [message, setMessage] = useState("Checking backend...");

  useEffect(() => {
    fetch("http://localhost:8000/api/health")
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
      })
      .catch((error) => {
        console.error("Backend connection failed:", error);
        setMessage("Backend connection failed!");
      });
  }, []);

  return <h2>{message}</h2>;
}

export default ApiTest;
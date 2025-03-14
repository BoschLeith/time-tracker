import { useEffect, useState } from "react";

export default function App() {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:5000/api");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setMessage(data.message);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  id: number;
  email: string;
}

const DashboardPage = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/user");
      const data = await response.json();

      if (data.error) {
        setError(data.error);
        router.push("/login");
      } else {
        setUserData(data);
      }
    };

    fetchData();
  }, [router]);

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      {userData ? (
        <div>
          <p>User ID: {userData.id}</p>
          <p>Email: {userData.email}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DashboardPage;

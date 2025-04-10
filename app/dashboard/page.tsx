"use client";

import {
  Alert,
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
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
      const response = await fetch("/api/protected/user");
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

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" component="div">
            Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography variant="h4" gutterBottom>
            Welcome to the Dashboard
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          {!userData ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mt={4}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Box mt={2}>
              <Typography>User ID: {userData.id}</Typography>
              <Typography>Email: {userData.email}</Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default DashboardPage;

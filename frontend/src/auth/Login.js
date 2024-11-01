import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/Globalcontext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser, setSports } = useGlobalContext();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    const loginData = {
      email,
      password,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Login successful!");

        // Store the token if returned
        if (result.token) {
          localStorage.setItem("token", result.token); // Store the token in localStorage
          setUser(result.user);
          localStorage.setItem("user", JSON.stringify(result.user));
          // if (result.user.role === "admin") {
          //   fetchSports(result.user.id);
          // } else {
          //   await getAllSports();
          // }
        }

        if (result.user.role === "admin") {
          navigate("/admin/dashboard");
        } else if (result.user.role === "player") {
          navigate("/player/dashboard");
        }
      } else {
        alert(result.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login");
    }
  };

  // const fetchSports = async (adminId) => {
  //   if (!adminId) return;

  //   try {
  //     const response = await fetch(
  //       `${process.env.REACT_APP_BACKEND_SERVER}/sports/admin/${adminId}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch sports");
  //     }

  //     const data = await response.json();
  //     setSports(data);
  //   } catch (error) {
  //     console.error("Error fetching sports:", error);
  //     alert("An error occurred while fetching sports");
  //   }
  // };

  // const getAllSports = async () => {
  //   try {
  //     const response = await fetch(
  //       `${process.env.REACT_APP_BACKEND_SERVER}/sports`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch sports");
  //     }

  //     const data = await response.json();
  //     setSports(data);
  //   } catch (error) {
  //     console.error("Error fetching all sports:", error);
  //     alert("An error occurred while fetching all sports");
  //   }
  // };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-md bg-white bg-opacity-90 p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-5 text-gray-800">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded p-2"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded p-2"
          />
          <input
            type="submit"
            value="Submit"
            className="w-full bg-blue-500 text-white font-bold py-2 rounded"
          />
        </form>
        <p className="mt-5 text-center">
          <a href="/signup" className="text-blue-500 hover:text-blue-700">
            Create Account..!
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import axios from "axios";
import { useUser } from "../context/userContext";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const apiUrl = process.env.REACT_APP_API_URL;

    const { setUser } = useUser();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (username.length < 3) {
            setError("Username must be at least 3 characters long.");
            setLoading(false);
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Please provide a valid email address.");
            setLoading(false);
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post("${apiUrl}/auth/register", {
                username,
                email,
                password,
            });

            const { userId, token } = response.data;

            if (userId && token) {
                setUser(userId, token);

                localStorage.setItem("userId", userId);
                localStorage.setItem("token", token);

                setSuccess("Registration successful!");

                setUsername("");
                setEmail("");
                setPassword("");
            } else {
                setError("Invalid response from server.");
            }
        } catch (err: any) {
            console.error("Registration error:", err);
            setError(err.response?.data?.error || "Failed to register. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex justify-center items-start h-screen bg-gray-100 mt-14">
            <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
                {error && <Alert severity="error" className="mb-4">{error}</Alert>}
                {success && <Alert severity="success" className="mb-4">{success}</Alert>}
                <form onSubmit={handleRegister}>
                    <div className="mb-4">
                        <TextField
                            fullWidth
                            label="Username"
                            variant="outlined"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex justify-center">
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
                        </Button>
                    </div>
                </form>
                <p className="text-sm text-center mt-4">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-500 hover:underline">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Register;

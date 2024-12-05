import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import axios from "axios";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { setUser } = useUser();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        console.log({ email, password });

        try {
            const response = await axios.post("http://localhost:3000/auth/login", {
                email,
                password,
            });

            const { user, token } = response.data;
            console.log("Login response data:", response.data);

            if (token && user) {

                setUser(user.id, token);
                localStorage.setItem("userId", user.id);
                localStorage.setItem("token", token);

                setSuccess("Login successful!");
                navigate("/vidz");
            } else {
                setError("Login failed, try again.");
            }
        } catch (err: any) {
            console.error("Login error:", err);
            setError(err.response?.data?.error || "Failed to login. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                {error && <Alert severity="error" className="mb-4">{error}</Alert>}
                {success && <Alert severity="success" className="mb-4">{success}</Alert>}
                <form onSubmit={handleLogin}>
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
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
                        </Button>
                    </div>
                </form>
                <p className="text-sm text-center mt-4">
                    Don't have an account?{" "}
                    <a href="/register" className="text-blue-500 hover:underline">
                        Register
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;

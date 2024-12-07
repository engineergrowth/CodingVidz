import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Post from "./pages/Post";
import { UserProvider } from "./context/userContext";
import Collection from "./pages/Collection";
import Navbar from "./components/Navbar";
import VidzList from "./pages/VidzList";
import MyPosts from "./pages/MyPosts";

const App = () => {
    return (
        <UserProvider>
            <Router>
                <div className="pb-20">
                    <Navbar />
                </div>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/post-vid" element={<Post />} />
                    <Route path="/collection" element={<Collection />} />
                    <Route path="/vidz" element={<VidzList />} />
                    <Route path="/my-posts" element={<MyPosts />} />
                    <Route path="/" element={<VidzList />} />
                </Routes>
            </Router>
        </UserProvider>
    );
};

export default App;

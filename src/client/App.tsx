import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Post from "./components/Post";
import { UserProvider } from "./context/userContext";
import Collection from "./components/Collection";
import Navbar from "./components/Navbar";
import VidzList from "./components/VidzList";
import MyPosts from "./components/MyPosts";

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

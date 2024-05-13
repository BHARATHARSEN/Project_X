import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import "./App.css";
import Home from "./components/Home";
import {Toaster} from 'react-hot-toast'
import ProductDetails from "./components/product/ProductDetails";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Profile from "./components/user/Profile";
import UpdateUser from "./components/user/UpdateUser";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UploadAvatar from "./components/user/UploadAvatar";

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster position="top-center" />
        <Header />

        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/me/Profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/me/upload_avatar"
              element={
                <ProtectedRoute>
                  <UploadAvatar />
                </ProtectedRoute>
              }
            />
            <Route path="/me/update" element={<UpdateUser />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;

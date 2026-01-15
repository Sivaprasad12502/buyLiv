import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Home from "./pages/Home";
import Home from "./pages/Home/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./auth/ProtectedRoute";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import JoiningPackages from "./pages/JoiningPackages";
import Cart from "./pages/Cart";
import CheckoutJoining from "./pages/CheckoutJoining";
import CheckoutNormal from "./pages/CheckoutNormal";
import Orders from "./pages/Orders";
import OrderSuccess from "./pages/OrderSuccess";
import Profile from "./pages/Profile";
import ReferralLink from "./pages/ReferralLink";
import TreeView from "./pages/TreeView";
import ApprovalRequests from "./pages/ApprovelRequests";
import BankDetail from "./pages/BankDetail";
function App() {
  return (
    <BrowserRouter>
      
      <Routes>
        {/* ===== PUBLIC ROUTES ===== */}
        {/* <Route path="/" element={<Home/>} /> */}
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/joining-packages" element={<JoiningPackages />} />

        {/* ===== PROTECTED ROUTES ===== */}
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout/joining" element={<CheckoutJoining />} />
          <Route path="/checkout/normal" element={<CheckoutNormal />} />
          <Route path="/checkout/normal/:productId" element={<CheckoutNormal />} />
          <Route path="/profile" element={<Profile />}/>
          <Route path="/orders" element={<Orders />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/referral" element={<ReferralLink />} />
          <Route path="/tree" element={<TreeView />} />
          <Route path="/mlm/requests" element={<ApprovalRequests />} />
          <Route path="/bankDetails" element={<BankDetail/>} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

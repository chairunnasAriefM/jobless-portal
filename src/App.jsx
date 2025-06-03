import './assets/tailwind.css';
import { Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import React from 'react';
// import Loading from './components/Loading';
import Index from './pages/Index';

// const JobApplication = React.lazy(() => import("./pages/JobApplication"))

function App() {
  return (
    // <Suspense fallback={<Loading />}>
    <Routes>
      {/* <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/users" element={<User />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
        </Route> */}

      <Route>
        {/* <Route path="/JobApplication" element={<JobApplication />} /> */}
        <Route path="/" element={<Index />} />
      </Route>

    </Routes>
    // </Suspense>
  );
}

export default App;

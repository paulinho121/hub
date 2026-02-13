import React from 'react';
import { Helmet } from 'react-helmet';
import AdminSetupHelper from '@/components/AdminSetupHelper';

const AdminSetupPage = () => {
  return (
    <div className="min-h-screen bg-black pt-24 px-4 pb-12 relative overflow-hidden">
      <Helmet>
        <title>Setup Admin - HubLumi</title>
      </Helmet>
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-black to-black pointer-events-none" />
      
      <div className="relative z-10">
        <AdminSetupHelper />
      </div>
    </div>
  );
};

export default AdminSetupPage;
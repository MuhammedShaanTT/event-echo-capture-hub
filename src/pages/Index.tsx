
import React from 'react';
import Dashboard from './Dashboard';
import { EventProvider } from '@/context/EventContext';
import Layout from '@/components/Layout';

const Index = () => {
  return (
    <EventProvider>
      <Layout>
        <Dashboard />
      </Layout>
    </EventProvider>
  );
};

export default Index;

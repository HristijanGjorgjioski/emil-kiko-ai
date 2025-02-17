'use client';
import React, { useState, useEffect } from 'react';
export const API_BASE_URL = 'http://localhost:3001/api';

const TestComponent: React.FC = () => {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const responseNestServer = await fetch(API_BASE_URL);
        if (!responseNestServer.ok) {
          throw new Error('Network response was not ok');
        }
        console.log('response', responseNestServer.body);
        const result = await responseNestServer.text();
        setData(result);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <div>{data ? data : 'No data available'}</div>;
};

export default TestComponent;

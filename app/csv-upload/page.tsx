'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CsvUploadPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResults(null);
    
    try {
      const formData = new FormData(e.currentTarget);
      const fileInput = e.currentTarget.elements.namedItem('file') as HTMLInputElement;
      
      if (!fileInput.files || fileInput.files.length === 0) {
        setError('Please select a CSV file');
        setIsLoading(false);
        return;
      }
      
      const response = await fetch('/api/auth/bulk-signup-csv', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'An error occurred while processing your request');
      } else {
        setResults(data);
      }
    } catch (err) {
      setError('An error occurred while submitting the form');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Bulk User Registration - CSV Upload</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
              CSV File (with email and password columns)
            </label>
            <input
              type="file"
              id="file"
              name="file"
              accept=".csv"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              disabled={isLoading}
            />
            <p className="mt-2 text-sm text-gray-500">
              The CSV file must include "email" and "password" columns.
            </p>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {isLoading ? 'Processing...' : 'Upload and Register Users'}
          </button>
        </form>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {results && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Results</h2>
          
          <div className="flex mb-4">
            <div className="w-1/3 bg-gray-50 p-3 rounded-l-md">
              <div className="text-2xl font-bold">{results.total}</div>
              <div className="text-sm text-gray-500">Total Users</div>
            </div>
            <div className="w-1/3 bg-green-50 p-3">
              <div className="text-2xl font-bold text-green-700">{results.successful}</div>
              <div className="text-sm text-gray-500">Successful</div>
            </div>
            <div className="w-1/3 bg-red-50 p-3 rounded-r-md">
              <div className="text-2xl font-bold text-red-700">{results.failed}</div>
              <div className="text-sm text-gray-500">Failed</div>
            </div>
          </div>
          
          {results.results && results.results.length > 0 && (
            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2">Detailed Results</h3>
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Error
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.results.map((result: any, index: number) => (
                      <tr key={index}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {result.email}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {result.success ? 'Success' : 'Failed'}
                          </span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          {result.error || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">CSV Template</h2>
        <div className="bg-gray-50 p-4 rounded-md">
          <pre className="text-sm text-gray-700">email,password
user1@example.com,password123
user2@example.com,password456</pre>
        </div>
        <div className="mt-3 flex">
          <a 
            href="/templates/users-template.csv" 
            download
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Download Template CSV
          </a>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Your CSV file should follow this format with the header row as shown.
        </p>
      </div>
    </div>
  );
} 
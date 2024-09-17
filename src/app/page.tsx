// app/page.tsx

'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [appKey, setAppKey] = useState('');
  const [imageUrl, setImageUrl] = useState('https://oaidalleapiprodscus.blob.core.windows.net/private/org-J3eFGhmXpN7i2wypdYBozkDd/user-Ly124Amif4GvR2rkdEOjFWXq/img-17EenozPNUd93LR7VV5wYm2P.png?st=2024-09-17T12%3A56%3A03Z&se=2024-09-17T14%3A56%3A03Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-09-16T23%3A10%3A49Z&ske=2024-09-17T23%3A10%3A49Z&sks=b&skv=2024-08-04&sig=DTICci25n3DrVt/8N18DUxrPu%2B%2BOUfx5l%2BcygGMRKL8%3D');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setImageUrl('');

    try {
      const response = await axios.post('/api/generate-image', { prompt, appKey });
      setImageUrl(response.data.imageUrl);
    } catch (err: any) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-8 font-sans min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">ChatGPT Image Generator</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-6 rounded shadow-md">
        <textarea
          className="w-full h-24 p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="ป้อน prompt ที่นี่..."
          required
        />
        <input
          type="password"
          className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={appKey}
          onChange={(e) => setAppKey(e.target.value)}
          placeholder="ป้อน App Key..."
          required
        />
        <button
          type="submit"
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'กำลังสร้างภาพ...' : 'สร้างภาพ'}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {imageUrl && (
        <div className="mt-6 w-1/2">
          <img src={imageUrl} alt="Generated" className="max-w-full h-auto rounded shadow-md" />
        </div>
      )}
    </div>
  );
}

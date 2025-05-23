'use client';

import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

type ApiResponse = {
  status: 'ok' | 'processing' | 'fail';
  link?: string;
  msg?: string;
};

const YoutubeMp3Downloader: React.FC = () => {
  const [videoId, setVideoId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);

  const fetchMp3 = async (id: string) => {
    const options = {
      method: 'GET' as const,
      url: 'https://youtube-mp36.p.rapidapi.com/dl',
      params: { id },
      headers: {
        'x-rapidapi-key': '89ec930f04msh7b57e5dc4d86cdcp10c630jsn025c279cc6c7',
        'x-rapidapi-host': 'youtube-mp36.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request<ApiResponse>(options);
      const { status, link, msg } = response.data;

      if (status === 'ok' && link) {
        setDownloadLink(link);
        toast.success('MP3 is ready to download!');
        setLoading(false);
      } else if (status === 'processing') {
        toast.loading('Processing... retrying in 1s', { id: 'processing' });
        setTimeout(() => fetchMp3(id), 1000);
      } else {
        throw new Error(msg || 'Conversion failed.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong.');
      setLoading(false);
    } finally {
      toast.dismiss('processing');
    }
  };

  const handleDownload = () => {
    if (!videoId.trim()) {
      toast.error('Please enter a valid YouTube video ID.');
      return;
    }
    setLoading(true);
    setDownloadLink(null);
    fetchMp3(videoId.trim());
  };

  return (
    <div className="min-h-screen flex flex-col gap-6 items-center justify-center bg-gradient-to-br from-[#18181b] via-[#1e1e23] to-[#111113] text-gray-100">
      <div className="bg-[#23232b] rounded-xl shadow-lg p-10 flex flex-col gap-6 w-full max-w-md">
        <h1 className="font-extrabold text-4xl md:text-5xl text-red-500 text-center drop-shadow-lg">
          YouTube to MP3
        </h1>
        <p className="text-base md:text-lg text-gray-300 text-center">
          Paste a YouTube video ID.
        </p>
        <input
          className="border border-red-500 bg-[#18181b] text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
          type="text"
          placeholder="e.g. UxxajLWwzqY"
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
        />
        <button
          onClick={handleDownload}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold transition 
            ${
              loading
                ? 'bg-red-900 text-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-md'
            }`}
        >
          {loading ? 'Converting...' : 'Convert to MP3'}
        </button>

        {downloadLink && (
          <div className="flex flex-col items-center gap-2 mt-4">
            <a
              href={downloadLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
            >
              🎵 Download MP3
            </a>
          </div>
        )}
      </div>
      <style jsx global>{`
        body {
          background: #18181b;
        }
      `}</style>
    </div>
  );
};

export default YoutubeMp3Downloader;
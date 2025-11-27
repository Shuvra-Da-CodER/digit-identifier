import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function Home() {
  const [imageBase64, setImageBase64] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch {
      setError('Failed to log out');
    }
  }

  function processFile(file) {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('File size exceeds 5MB limit');
      return;
    }

    setError('');
    const reader = new FileReader();

    reader.onload = (event) => {
      const base64String = event.target.result;
      setImageBase64(base64String);
      setImagePreview(base64String);
      setResult(null);
    };

    reader.readAsDataURL(file);
  }

  function handleFileSelect(e) {
    const file = e.target.files[0];
    processFile(file);
  }

  async function analyzeImage() {
    if (!imageBase64) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageBase64 }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const data = await response.json();
      setResult(data.number);
    } catch {
      setError('Failed to analyze image. Please try again.');
    }

    setLoading(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    processFile(file);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Navbar */}
      <nav className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-zinc-50">Digit Reader</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-zinc-800 text-zinc-50 px-4 py-2 rounded hover:bg-zinc-700 transition-colors"
          >
            <LogoutIcon fontSize="small" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-3 bg-red-950 border border-red-800 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Zone */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-zinc-50">Upload Image</h2>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-zinc-800 rounded-lg p-12 cursor-pointer hover:border-zinc-700 transition-colors flex flex-col items-center justify-center min-h-[300px]"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
              />
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-full max-h-64 object-contain"
                />
              ) : (
                <>
                  <CloudUploadIcon className="text-zinc-600 mb-4" style={{ fontSize: 48 }} />
                  <p className="text-zinc-400 text-center">
                    Click or drag an image here
                  </p>
                  <p className="text-zinc-600 text-sm mt-2">
                    Supports PNG, JPG, GIF
                  </p>
                </>
              )}
            </div>

            <button
              onClick={analyzeImage}
              disabled={!imageBase64 || loading}
              className="w-full bg-zinc-100 text-zinc-950 py-3 rounded font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ImageIcon fontSize="small" />
              {loading ? 'Analyzing...' : 'Analyze Digit'}
            </button>
          </div>

          {/* Result Display */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-zinc-50">Result</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg min-h-[300px] flex items-center justify-center">
              {result !== null ? (
                <span className="text-9xl font-thin text-zinc-50">{result}</span>
              ) : (
                <p className="text-zinc-600">
                  Upload an image to see the detected digit
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

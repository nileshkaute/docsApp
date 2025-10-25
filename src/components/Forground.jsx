import React, { useRef, useState, useEffect } from 'react';
import { Card } from './Card';
import AuthModal from './AuthModal';
import apiClient from '../apiClient';

const Foreground = () => {
  const ref = useRef(null);
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await apiClient.getMe();
        setUser(userData);
      } catch (error) {
        console.log('Not authenticated');
        setShowAuthModal(true);
      }
    };

    checkAuth();
  }, []);

  // Load files
  useEffect(() => {
    if (!user) return;
    
    const fetchFiles = async () => {
      setLoading(true);
      try {
        const data = await apiClient.getFiles();
        setCards(data || []);
      } catch (error) {
        console.error('Error fetching files:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [user]);

  const handleAuthSuccess = async () => {
    try {
      const userData = await apiClient.getMe();
      setUser(userData);
      setShowAuthModal(false);
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  const handleLogout = () => {
    apiClient.logout();
    setUser(null);
    setCards([]);
    setShowAuthModal(true);
  };

  const handleFileUpload = async (e) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    try {
      const newFile = await apiClient.uploadFile(file);
      setCards([newFile, ...cards]);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading file: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (url, id) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "";
    link.click();

    try {
      await apiClient.updateFileTag(id, "Downloaded", "blue");
      setCards(cards.map(c =>
        c.id === id ? { ...c, tagTitle: "Downloaded", tagColor: "blue" } : c
      ));
    } catch (error) {
      console.error('Error updating tag:', error);
    }
  };

  const handleRemove = async (id) => {
    try {
      await apiClient.deleteFile(id);
      setCards(cards.filter(c => c.id !== id));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting file');
    }
  };

  const filteredCards = cards.filter(c => 
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  if (!user) {
    return <AuthModal isOpen={showAuthModal} onClose={() => {}} onSuccess={handleAuthSuccess} />;
  }

  return (
    <div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onSuccess={handleAuthSuccess} />
      
      {/* Bottom controls */}
      <div className='fixed bottom-5 left-0 right-0 z-[4] flex justify-center'>
        <div className='flex flex-wrap gap-2 items-center bg-zinc-900/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-zinc-600'>
          {/* Upload button on left */}
          <label className='px-3 py-2 bg-blue-800 text-white rounded-lg cursor-pointer transition-colors'>
            {loading ? 'Uploading...' : '+ Upload File'}
            <input 
              type="file" 
              className="hidden" 
              onChange={handleFileUpload}
              disabled={loading}
            />
          </label>
          
          {/* Search in middle */}
          <input
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 py-2 rounded-lg border text-white border-zinc-600 bg-zinc-800 focus:outline-none focus:border-zinc-500 transition-colors w-40 sm:w-48"
          />
          
          {/* User info and logout on right */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-2 bg-green-800 text-white rounded-lg border border-green-400 hidden sm:block">
              <span className="text-sm">👤 {user.name}</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-purple-800 text-white rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Cards container - scrollbar removed */}
      <div 
        ref={ref} 
        className='fixed top-0 left-0 z-[3] w-full h-full flex gap-5 sm:gap-10 flex-wrap p-5 pt-5 overflow-y-auto'
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {/* Hide scrollbar for Webkit browsers */}
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {loading && cards.length === 0 ? (
          <div className="w-full flex items-center justify-center h-full">
            <p className="text-white text-lg">Loading files...</p>
          </div>
        ) : filteredCards.length === 0 ? (
          <div className="w-full flex items-center justify-center h-full">
            <p className="text-white text-lg">No files found</p>
          </div>
        ) : (
          filteredCards.map(item => (
            <Card
              key={item.id}
              data={{
                ...item,
                desc: item.description,
                tag: {
                  isopen: true,
                  tagTitle: item.tagTitle,
                  tagColor: item.tagColor
                },
                close: true
              }}
              reference={ref}
              onRemove={() => handleRemove(item.id)}
              onDownload={() => handleDownload(item.fileUrl, item.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Foreground;
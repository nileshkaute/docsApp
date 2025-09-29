import React, { useRef, useState, useEffect } from 'react';
import { Card } from './Card';
import { supabase } from '../supabaseClient';

const Forground = () => {
  const ref = useRef(null);
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Authenticate anonymously
  useEffect(() => {
    const initAuth = async () => {
      // Check if user exists
      const { data: { user: existingUser } } = await supabase.auth.getUser();
      
      if (!existingUser) {
        // Sign in anonymously
        const { data, error } = await supabase.auth.signInAnonymously();
        if (error) console.error('Auth error:', error);
        else setUser(data.user);
      } else {
        setUser(existingUser);
      }
    };

    initAuth();

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 🔹 Load files from Supabase for this user
  useEffect(() => {
    if (!user) return;
    
    const fetchFiles = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('userId', user.id)
        .order('createdAt', { ascending: false });

      if (error) {
        console.error('Error fetching files:', error);
      } else {
        setCards(data || []);
      }
      setLoading(false);
    };

    fetchFiles();
  }, [user]);

  // 🔹 Upload file
  const handleFileUpload = async (e) => {
    if (!user) return alert("Not logged in");
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    try {
      // Upload to Supabase Storage
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `${user.id}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('files')
        .getPublicUrl(filePath);

      // Save metadata in Database
      const { data: dbData, error: dbError } = await supabase
        .from('files')
        .insert([
          {
            userId: user.id,
            description: file.name,
            filesize: (file.size / (1024 * 1024)).toFixed(2) + " MB",
            fileUrl: publicUrl,
            fileType: file.type,
            tagTitle: "Uploaded",
            tagColor: "green"
          }
        ])
        .select()
        .single();

      if (dbError) throw dbError;

      // Add to state
      setCards([dbData, ...cards]);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading file: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Download
  const handleDownload = async (url, id) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "";
    link.click();

    // Update tag to "Downloaded"
    await supabase
      .from('files')
      .update({ tagTitle: "Downloaded", tagColor: "blue" })
      .eq('id', id);

    setCards(cards.map(c =>
      c.id === id ? { ...c, tagTitle: "Downloaded", tagColor: "blue" } : c
    ));
  };

  // 🔹 Remove file
  const handleRemove = async (id, fileUrl) => {
    try {
      // Extract file path from URL
      const urlParts = fileUrl.split('/files/');
      const filePath = urlParts[1];

      // Delete from storage
      await supabase.storage.from('files').remove([filePath]);

      // Delete from database
      await supabase.from('files').delete().eq('id', id);

      // Update state
      setCards(cards.filter(c => c.id !== id));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting file');
    }
  };

  const filteredCards = cards.filter(c => 
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className='fixed top-5 right-5 z-[4] flex gap-2'>
        <label className='px-4 py-2 bg-zinc-700 text-white rounded-lg shadow hover:bg-zinc-600 cursor-pointer'>
          {loading ? 'Uploading...' : '+ Upload File'}
          <input 
            type="file" 
            className="hidden" 
            onChange={handleFileUpload}
            disabled={loading}
          />
        </label>
        <input
          type="text"
          placeholder="Search files..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 rounded-lg border text-white border-gray-400 bg-zinc-800"
        />
      </div>

      <div ref={ref} className='fixed top-0 left-0 z-[3] w-full h-full flex gap-10 flex-wrap p-5'>
        {loading && cards.length === 0 ? (
          <p className="text-white">Loading files...</p>
        ) : filteredCards.length === 0 ? (
          <p className="text-white">No files found</p>
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
              onRemove={() => handleRemove(item.id, item.fileUrl)}
              onDownload={() => handleDownload(item.fileUrl, item.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Forground;
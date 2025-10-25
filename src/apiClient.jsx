const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// IndexedDB configuration
const DB_NAME = 'FileManagerDB';
const DB_VERSION = 1;
const USER_STORE = 'users';
const FILE_STORE = 'files';

class IndexedDBManager {
  constructor() {
    this.db = null;
    this.initialized = false;
    this.initPromise = null;
  }

  // Initialize database
  async init() {
    // If already initializing, return the same promise
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('IndexedDB error:', request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        this.db = request.result;
        this.initialized = true;
        console.log('IndexedDB initialized successfully');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        console.log('IndexedDB upgrade needed');
        const db = event.target.result;

        // Create users store
        if (!db.objectStoreNames.contains(USER_STORE)) {
          const userStore = db.createObjectStore(USER_STORE, { keyPath: 'email' });
          userStore.createIndex('id', 'id', { unique: true });
        }

        // Create files store
        if (!db.objectStoreNames.contains(FILE_STORE)) {
          const fileStore = db.createObjectStore(FILE_STORE, { keyPath: 'id' });
          fileStore.createIndex('userId', 'userId', { unique: false });
          fileStore.createIndex('email', 'email', { unique: false });
        }
      };
    });

    return this.initPromise;
  }

  // Ensure database is ready
  async ensureDB() {
    if (!this.initialized) {
      await this.init();
    }
    return this.db;
  }

  // Generic CRUD operations
  async add(storeName, data) {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async get(storeName, key) {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getAll(storeName, indexName = null, key = null) {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      
      let request;
      if (indexName && key) {
        const index = store.index(indexName);
        request = index.getAll(key);
      } else {
        request = store.getAll();
      }

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
    });
  }

  async update(storeName, data) {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async delete(storeName, key) {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }
}

// Initialize IndexedDB manager
const dbManager = new IndexedDBManager();

// Simple user management
const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

const setCurrentUser = (user) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

const removeCurrentUser = () => {
  localStorage.removeItem('currentUser');
};

// Generate unique ID
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

// Get color and tag based on file type
const getFileTypeInfo = (fileName, fileType) => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  if (fileType === 'application/pdf' || extension === 'pdf') {
    return { tagTitle: "PDF", tagColor: "red" };
  }
  
  if (fileType.startsWith('image/')) {
    if (extension === 'jpg' || extension === 'jpeg') return { tagTitle: "JPG", tagColor: "blue" };
    if (extension === 'png') return { tagTitle: "PNG", tagColor: "blue" };
    if (extension === 'gif') return { tagTitle: "GIF", tagColor: "blue" };
    if (extension === 'svg') return { tagTitle: "SVG", tagColor: "blue" };
    if (extension === 'webp') return { tagTitle: "WEBP", tagColor: "blue" };
    return { tagTitle: "Image", tagColor: "blue" };
  }
  
  // ... (keep the rest of your getFileTypeInfo function the same)
  // Document files
  if (fileType.includes('document') || fileType.includes('msword')) {
    if (extension === 'docx') return { tagTitle: "DOCX", tagColor: "green" };
    if (extension === 'doc') return { tagTitle: "DOC", tagColor: "green" };
    return { tagTitle: "Document", tagColor: "green" };
  }
  
  if (fileType.includes('text/') || extension === 'txt') {
    return { tagTitle: "TXT", tagColor: "green" };
  }
  
  // Spreadsheet files
  if (fileType.includes('spreadsheet') || fileType.includes('excel')) {
    if (extension === 'xlsx') return { tagTitle: "XLSX", tagColor: "orange" };
    if (extension === 'xls') return { tagTitle: "XLS", tagColor: "orange" };
    if (extension === 'csv') return { tagTitle: "CSV", tagColor: "orange" };
    return { tagTitle: "Spreadsheet", tagColor: "orange" };
  }
  
  // Presentation files
  if (fileType.includes('presentation') || fileType.includes('powerpoint')) {
    if (extension === 'pptx') return { tagTitle: "PPTX", tagColor: "purple" };
    if (extension === 'ppt') return { tagTitle: "PPT", tagColor: "purple" };
    return { tagTitle: "Presentation", tagColor: "purple" };
  }
  
  // Archive files
  if (fileType.includes('archive') || fileType.includes('compressed') || fileType.includes('zip')) {
    if (extension === 'zip') return { tagTitle: "ZIP", tagColor: "yellow" };
    if (extension === 'rar') return { tagTitle: "RAR", tagColor: "yellow" };
    if (extension === '7z') return { tagTitle: "7Z", tagColor: "yellow" };
    return { tagTitle: "Archive", tagColor: "yellow" };
  }
  
  if (extension === 'js' || extension === 'jsx') return { tagTitle: "JavaScript", tagColor: "pink" };
  if (extension === 'ts' || extension === 'tsx') return { tagTitle: "TypeScript", tagColor: "pink" };
  if (extension === 'html') return { tagTitle: "HTML", tagColor: "pink" };
  if (extension === 'css') return { tagTitle: "CSS", tagColor: "pink" };
  if (extension === 'py') return { tagTitle: "Python", tagColor: "pink" };
  if (extension === 'java') return { tagTitle: "Java", tagColor: "pink" };
  if (extension === 'cpp' || extension === 'c') return { tagTitle: "C++", tagColor: "pink" };
  if (extension === 'php') return { tagTitle: "PHP", tagColor: "pink" };
  if (extension === 'json') return { tagTitle: "JSON", tagColor: "pink" };
  
  if (fileType.startsWith('video/')) {
    if (extension === 'mp4') return { tagTitle: "MP4", tagColor: "indigo" };
    if (extension === 'avi') return { tagTitle: "AVI", tagColor: "indigo" };
    if (extension === 'mov') return { tagTitle: "MOV", tagColor: "indigo" };
    if (extension === 'webm') return { tagTitle: "WEBM", tagColor: "indigo" };
    return { tagTitle: "Video", tagColor: "indigo" };
  }
  
  if (fileType.startsWith('audio/')) {
    if (extension === 'mp3') return { tagTitle: "MP3", tagColor: "teal" };
    if (extension === 'wav') return { tagTitle: "WAV", tagColor: "teal" };
    if (extension === 'ogg') return { tagTitle: "OGG", tagColor: "teal" };
    if (extension === 'flac') return { tagTitle: "FLAC", tagColor: "teal" };
    return { tagTitle: "Audio", tagColor: "teal" };
  }
  
  if (extension === 'pdf') return { tagTitle: "PDF", tagColor: "red" };
  if (extension.match(/(jpg|jpeg|png|gif|bmp|webp|svg)$/)) return { tagTitle: "Image", tagColor: "blue" };
  if (extension.match(/(doc|docx|txt|rtf)$/)) return { tagTitle: "Document", tagColor: "green" };
  if (extension.match(/(xls|xlsx|csv)$/)) return { tagTitle: "Spreadsheet", tagColor: "orange" };
  if (extension.match(/(ppt|pptx)$/)) return { tagTitle: "Presentation", tagColor: "purple" };
  if (extension.match(/(zip|rar|7z|tar|gz)$/)) return { tagTitle: "Archive", tagColor: "yellow" };
  if (extension.match(/(mp4|avi|mov|wmv|flv|webm|mkv)$/)) return { tagTitle: "Video", tagColor: "indigo" };
  if (extension.match(/(mp3|wav|ogg|flac|aac)$/)) return { tagTitle: "Audio", tagColor: "teal" };
  
  return { tagTitle: "File", tagColor: "gray" };
};

// API client with IndexedDB
const apiClient = {
  // Initialize database - ensure it's ready
  async ensureInitialized() {
    await dbManager.init();
  },

  // Auth endpoints
  register: async (email, password, name) => {
    await dbManager.init();
    
    const existingUser = await dbManager.get(USER_STORE, email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const newUser = {
      email,
      id: generateId(),
      name: name || email.split('@')[0],
      createdAt: new Date().toISOString()
    };

    await dbManager.add(USER_STORE, newUser);
    setCurrentUser(newUser);
    
    return { user: newUser, message: 'Registration successful' };
  },

  login: async (email, password) => {
    await dbManager.init();
    
    const existingUser = await dbManager.get(USER_STORE, email);
    if (!existingUser) {
      throw new Error('User not found. Please sign up first.');
    }

    setCurrentUser(existingUser);
    return { user: existingUser, message: 'Login successful' };
  },

  getMe: async () => {
    const user = getCurrentUser();
    if (!user) throw new Error('Not authenticated');
    return user;
  },

  logout: () => {
    removeCurrentUser();
  },

  // File endpoints
  uploadFile: async (file) => {
    const user = getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    await dbManager.init();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const fileTypeInfo = getFileTypeInfo(file.name, file.type);
          
          const newFile = {
            id: generateId(),
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            description: file.name,
            fileUrl: e.target.result,
            tagTitle: fileTypeInfo.tagTitle,
            tagColor: fileTypeInfo.tagColor,
            uploadedAt: new Date().toISOString(),
            userId: user.id,
            email: user.email,
            fileExtension: file.name.split('.').pop()?.toLowerCase() || ''
          };

          await dbManager.add(FILE_STORE, newFile);
          resolve(newFile);
        } catch (error) {
          reject(new Error('Failed to process file: ' + error.message));
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  },

  getFiles: async () => {
    const user = getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    await dbManager.init();
    
    const files = await dbManager.getAll(FILE_STORE, 'email', user.email);
    
    const formattedFiles = files.map(file => ({
      ...file,
      tagTitle: file.tagTitle || "File",
      tagColor: file.tagColor || "gray",
      description: file.description || file.fileName || "Untitled File",
      fileName: file.fileName || "Untitled File",
      fileSize: file.fileSize || 0,
      fileType: file.fileType || "application/octet-stream",
      fileUrl: file.fileUrl || "",
      uploadedAt: file.uploadedAt || new Date().toISOString()
    }));
    
    return formattedFiles;
  },

  updateFileTag: async (id, tagTitle, tagColor) => {
    const user = getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    await dbManager.init();
    
    const file = await dbManager.get(FILE_STORE, id);
    if (!file) {
      throw new Error('File not found');
    }

    file.tagTitle = tagTitle;
    file.tagColor = tagColor;
    
    await dbManager.update(FILE_STORE, file);
    return file;
  },

  deleteFile: async (id) => {
    const user = getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    await dbManager.init();
    await dbManager.delete(FILE_STORE, id);
    
    return { message: 'File deleted successfully' };
  },

  checkUserExists: async (email) => {
    await dbManager.init();
    const user = await dbManager.get(USER_STORE, email);
    return !!user;
  }
};

export default apiClient;
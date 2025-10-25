# Document & File Manager Web App

A modern, drag-and-drop file management web application built with React that allows users to upload, organize, and manage files directly in their browser with persistent local storage.

## 🌟 Features

- **📁 File Upload & Management**: Drag-and-drop file uploads with support for all file types
- **🎨 Smart File Categorization**: Automatic color-coding and tagging based on file types (PDF, Images, Documents, Videos, Audio, etc.)
- **🔍 Search Functionality**: Quickly find files by name or description
- **💾 Local Storage**: Uses IndexedDB for reliable, large-capacity file storage (supports videos, audio, and large files)
- **👤 User Authentication**: Simple login/signup system with user isolation
- **📱 Responsive Design**: Works perfectly on desktop and mobile devices
- **🎯 Interactive UI**: Draggable file cards with smooth animations
- **⚡ Fast Performance**: Optimized for quick file operations and rendering


## 🛠️ Tech Stack

- **Frontend**: React, JavaScript, Tailwind CSS
- **State Management**: React Hooks (useState, useEffect)
- **File Storage**: IndexedDB (for large file support)
- **Icons**: React Icons
- **Animations**: Framer Motion
- **Build Tool**: Vite

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/file-manager-app.git
   cd file-manager-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🎯 Usage

### For Users:
1. **Sign Up/Login**: Create an account or login with existing credentials
2. **Upload Files**: Click the "Upload File" button or drag files directly
3. **Organize**: Files are automatically categorized by type with color-coded tags
4. **Search**: Use the search bar to quickly find specific files
5. **Download/Delete**: Use the action buttons on each file card

### File Type Support:
- 📄 **Documents**: PDF, DOC, DOCX, TXT (Red/Green)
- 🖼️ **Images**: JPG, PNG, GIF, SVG, WEBP (Blue)
- 📊 **Spreadsheets**: XLS, XLSX, CSV (Orange)
- 🎬 **Videos**: MP4, AVI, MOV, WEBM (Indigo)
- 🎵 **Audio**: MP3, WAV, OGG, FLAC (Teal)
- 📦 **Archives**: ZIP, RAR, 7Z (Yellow)
- 💻 **Code**: JS, HTML, CSS, Python, Java (Pink)
- 🎨 **Presentations**: PPT, PPTX (Purple)

## 🗂️ Project Structure

```
src/
├── components/
│   ├── Card.js          # File card component with drag functionality
│   ├── Foreground.js    # Main file display and management
│   └── AuthModal.js     # Authentication modal
├── apiClient.js         # IndexedDB and file management logic
├── App.js              # Main application component
└── main.js             # Application entry point
```

## 🔧 Configuration

The app uses environment variables for configuration:

```env
VITE_API_URL=http://localhost:5000/api  # For future backend integration
```

## 💾 Storage Details

- **Technology**: IndexedDB (Client-side database)
- **Capacity**: Supports large files (videos, audio, etc.)
- **Persistence**: Data remains until explicitly deleted
- **User Isolation**: Each user has separate file storage
- **Performance**: Asynchronous operations for smooth UX

## 🎨 Customization

### Adding New File Types:
Edit the `getFileTypeInfo` function in `apiClient.js`:

```javascript
// Add new file type detection
if (extension === 'your-extension') {
  return { tagTitle: "Your Type", tagColor: "color" };
}
```

### Modifying Colors:
Update the color mappings in `Card.js` and `apiClient.js`:

```javascript
const colorMap = {
  yourColor: "bg-yourColor-600",
  // ... existing colors
};
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues

- Large video files may take time to process (browser limitation)
- Mobile drag-and-drop has some limitations
- No file compression for very large files

## 🔮 Future Enhancements

- [ ] File sharing between users
- [ ] File compression
- [ ] Cloud storage integration
- [ ] File preview for more formats
- [ ] Bulk operations
- [ ] Folder organization
- [ ] File versioning

## 📞 Support

If you have any questions or issues, please open an issue on GitHub.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Framer Motion for smooth animations
- React Icons for the beautiful icon set

---

**⭐ Don't forget to star this repository if you find it useful!**

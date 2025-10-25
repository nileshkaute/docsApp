import React from 'react';
import { FaRegFileAlt, FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaFileImage, FaFileArchive, FaFileCode, FaFileVideo, FaFileAudio } from 'react-icons/fa';
import { LuDownload } from 'react-icons/lu';
import { IoClose } from 'react-icons/io5';
import { motion } from "motion/react";

export const Card = ({ data, reference, onRemove, onDownload }) => {

  const getFileIcon = () => {
    if (data.fileType.startsWith("image/")) {
      return <img src={data.fileUrl} alt={data.desc} className="max-h-28 object-contain" />;
    }
    if (data.fileType === "application/pdf") return <FaFilePdf size={40} />;
    if (data.fileType.includes("word") || data.fileType.includes("document")) return <FaFileWord size={40} />;
    if (data.fileType.includes("excel") || data.fileType.includes("spreadsheet")) return <FaFileExcel size={40} />;
    if (data.fileType.includes("powerpoint") || data.fileType.includes("presentation")) return <FaFilePowerpoint size={40} />;
    if (data.fileType.includes("archive") || data.fileType.includes("zip") || data.fileType.includes("rar")) return <FaFileArchive size={40} />;
    if (data.fileType.includes("video")) return <FaFileVideo size={40} />;
    if (data.fileType.includes("audio")) return <FaFileAudio size={40} />;
    if (data.fileType.includes("text") || data.tag.tagTitle === "Code" || data.tag.tagTitle === "JavaScript" || data.tag.tagTitle === "TypeScript" || data.tag.tagTitle === "HTML" || data.tag.tagTitle === "CSS" || data.tag.tagTitle === "Python" || data.tag.tagTitle === "Java") return <FaFileCode size={40} />;
    return <FaRegFileAlt size={40} />;
  };

  // Function to get tag background color based on tagColor
  const getTagColor = () => {
    const colorMap = {
      red: "bg-red-600",
      blue: "bg-blue-600",
      green: "bg-green-600",
      orange: "bg-orange-600",
      purple: "bg-purple-600",
      yellow: "bg-yellow-600",
      pink: "bg-pink-600",
      indigo: "bg-indigo-600",
      teal: "bg-teal-600",
      gray: "bg-gray-600"
    };
    return colorMap[data.tag.tagColor] || "bg-green-600";
  };

  // Function to get card background color based on file type
  const getCardColor = () => {
    const colorMap = {
      red: "bg-zinc-800/90 border-l-4 border-l-red-500",
      blue: "bg-zinc-800/90 border-l-4 border-l-blue-500", 
      green: "bg-zinc-800/90 border-l-4 border-l-green-500",
      orange: "bg-zinc-800/90 border-l-4 border-l-orange-500",
      purple: "bg-zinc-800/90 border-l-4 border-l-purple-500",
      yellow: "bg-zinc-800/90 border-l-4 border-l-yellow-500",
      pink: "bg-zinc-800/90 border-l-4 border-l-pink-500",
      indigo: "bg-zinc-800/90 border-l-4 border-l-indigo-500",
      teal: "bg-zinc-800/90 border-l-4 border-l-teal-500",
      gray: "bg-zinc-800/90 border-l-4 border-l-gray-500"
    };
    return colorMap[data.tag.tagColor] || "bg-zinc-800/90 border-l-4 border-l-green-500";
  };

  // Function to get icon color based on file type
  const getIconColor = () => {
    const colorMap = {
      red: "text-red-400",
      blue: "text-blue-400",
      green: "text-green-400", 
      orange: "text-orange-400",
      purple: "text-purple-400",
      yellow: "text-yellow-400",
      pink: "text-pink-400",
      indigo: "text-indigo-400",
      teal: "text-teal-400",
      gray: "text-gray-400"
    };
    return colorMap[data.tag.tagColor] || "text-green-400";
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return 'Size unknown';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  return (
    <motion.div
      drag
      dragConstraints={reference}
      whileDrag={{ scale: 1.1 }}
      dragElastic={0.1}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 10 }}
      className={`relative flex-shrink-0 w-60 h-72 rounded-[20px] text-white px-5 py-6 overflow-hidden shadow-lg hover:shadow-xl transition-shadow ${getCardColor()}`}
    >
      {/* File Preview */}
      <div className={`w-full h-32 flex items-center justify-center bg-zinc-900/50 rounded-lg mb-4 ${getIconColor()}`}>
        {getFileIcon()}
      </div>

      {/* File Info */}
      <p className='text-sm leading-tight font-semibold truncate mb-2' title={data.desc}>
        {data.desc}
      </p>
      
      {/* File Size - Only show file size, no file type text */}
      <div className="text-xs text-zinc-400 mb-4">
        {formatFileSize(data.fileSize)}
      </div>

      {/* Footer */}
      <div className="footer absolute bottom-0 left-0 w-full">
        <div className='flex justify-between py-3 px-6 items-center mb-3'>
          {/* Empty space where file type text was removed */}
          <div></div>
          <div className='flex gap-2'>
            <span
              className='w-7 h-7 bg-zinc-700 rounded-full flex justify-center items-center cursor-pointer hover:bg-zinc-600 transition-colors'
              onClick={onDownload}
              title="Download"
            >
              <LuDownload size="0.8em" color="white" />
            </span>
            {data.close && (
              <span
                className='w-7 h-7 bg-zinc-700 rounded-full flex justify-center items-center cursor-pointer hover:bg-red-600 transition-colors'
                onClick={onRemove}
                title="Delete"
              >
                <IoClose color="white" />
              </span>
            )}
          </div>
        </div>

        {data.tag.isopen && (
          <div className={`tag w-full py-3 ${getTagColor()} flex items-center justify-center`}>
            <h3 className='text-sm font-semibold'>{data.tag.tagTitle}</h3>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Card;
import React from 'react';
import { FaRegFileAlt, FaFilePdf, FaFileWord } from 'react-icons/fa';
import { LuDownload } from 'react-icons/lu';
import { IoClose } from 'react-icons/io5';
import { motion } from "motion/react";

export const Card = ({ data, reference, onRemove, onDownload }) => {

  const getFileIcon = () => {
    if (data.fileType.startsWith("image/")) {
      return <img src={data.fileUrl} alt={data.desc} className="max-h-28 object-contain" />;
    }
    if (data.fileType === "application/pdf") return <FaFilePdf size={40} />;
    if (data.fileType.includes("word")) return <FaFileWord size={40} />;
    return <FaRegFileAlt size={40} />;
  };

  return (
    <motion.div
      drag
      dragConstraints={reference}
      whileDrag={{ scale: 1.1 }}
      dragElastic={0.1}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 10 }}
      className='relative flex-shrink-0 w-60 h-72 bg-zinc-800/80 rounded-[20px] text-white px-5 py-6 overflow-hidden shadow-lg hover:shadow-xl transition-shadow'
    >
      {/* File Preview */}
      <div className="w-full h-32 flex items-center justify-center bg-zinc-900 rounded-lg mb-4">
        {getFileIcon()}
      </div>

      {/* File Info */}
      <p className='text-sm leading-tight font-semibold truncate' title={data.desc}>
        {data.desc}
      </p>

      {/* Footer */}
      <div className="footer absolute bottom-0 left-0 w-full">
        <div className='flex justify-between py-3 px-6 items-center mb-3'>
          <h5 className="text-xs text-zinc-400">{data.filesize}</h5>
          <div className='flex gap-2'>
            <span
              className='w-7 h-7 bg-zinc-200 rounded-full flex justify-center items-center cursor-pointer hover:bg-zinc-300 transition-colors'
              onClick={onDownload}
              title="Download"
            >
              <LuDownload size="0.8em" color="black" />
            </span>
            {data.close && (
              <span
                className='w-7 h-7 bg-zinc-200 rounded-full flex justify-center items-center cursor-pointer hover:bg-red-100 transition-colors'
                onClick={onRemove}
                title="Delete"
              >
                <IoClose color="black" />
              </span>
            )}
          </div>
        </div>

        {data.tag.isopen && (
          <div className={`tag w-full py-3 ${data.tag.tagColor === "blue" ? "bg-blue-600" : "bg-green-600"} flex items-center justify-center`}>
            <h3 className='text-sm font-semibold'>{data.tag.tagTitle}</h3>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Card;
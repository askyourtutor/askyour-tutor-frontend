import React from 'react';
import { IconBook, IconClock, IconPlayerPlay } from '@tabler/icons-react';

interface VideoPlayerProps {
  isPlaying: boolean;
  onTogglePlay: (playing: boolean) => void;
  src?: string;
  poster?: string;
  totalDurationMin: number;
  lessonsCount: number;
  rating: number;
  renderStars: (rating: number) => React.ReactNode;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  isPlaying,
  onTogglePlay,
  src,
  poster,
  totalDurationMin,
  lessonsCount,
  rating,
  renderStars,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      <div className="relative aspect-video bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {!isPlaying || !src ? (
          <div className={`relative w-full h-full ${src ? 'group cursor-pointer' : ''}`} onClick={() => src && onTogglePlay(true)}>
            {poster && <img src={poster} alt="Course preview" className="w-full h-full object-cover" />}
            {!src && !poster && (
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center text-white space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 backdrop-blur-sm flex items-center justify-center border border-red-500/30">
                    <IconPlayerPlay size={28} className="text-red-400 ml-0.5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">No Video Available</h3>
                  <p className="text-sm text-gray-400 max-w-xs mx-auto">Please select a lesson from the syllabus to begin</p>
                </div>
              </div>
            )}
            {/* Gradient Overlay */}
            {(poster || src) && <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>}

            {/* Play Button */}
            {src && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl scale-150"></div>
                  <button className="relative w-20 h-20 lg:w-24 lg:h-24 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-2xl">
                    <IconPlayerPlay size={36} className="text-blue-600 ml-1" />
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Info Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-white gap-2 sm:gap-0">
                <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-black/40 backdrop-blur-md rounded-sm px-2 sm:px-3 py-1.5 sm:py-2">
                    <IconClock size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="font-medium text-xs sm:text-sm">{totalDurationMin} min</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-black/40 backdrop-blur-md rounded-sm px-2 sm:px-3 py-1.5 sm:py-2">
                    <IconBook size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="font-medium text-xs sm:text-sm">{lessonsCount} lessons</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 bg-black/40 backdrop-blur-md rounded-sm px-2 sm:px-3 py-1.5 sm:py-2">
                  <div className="flex gap-0.5">{renderStars(rating)}</div>
                  <span className="font-semibold ml-1 text-xs sm:text-sm">{rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <video controls autoPlay className="w-full h-full" src={src} onEnded={() => onTogglePlay(false)} />
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;

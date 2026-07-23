import { forwardRef } from 'react';
import type { StripStyle, ColorMode } from '../types';

interface PhotoStripProps {
  photos: string[];
  colorMode: ColorMode;
  showTimestamp?: boolean;
  stripStyle?: StripStyle;
  roundedEdges?: boolean;
}

/**
 * PhotoStrip — rendered off-screen for html-to-image capture.
 *
 * Three modes driven by stripStyle:
 *  'white' — classic white-background strip with paper texture
 *  'black' — dark (#0f0f0f) moody strip with cream timestamp text
 *  'film'  — no background, photos flush together (timestamp hidden)
 */
const PhotoStrip = forwardRef<HTMLDivElement, PhotoStripProps>(
  ({ photos, colorMode, showTimestamp = false, stripStyle = 'white', roundedEdges = true }, ref) => {
    const now = new Date();
    const tz = 'Asia/Kolkata';
    const dateStr = now.toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric', timeZone: tz,
    });
    const timeStr = now
      .toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: tz })
      .toUpperCase();

    const isFilm  = stripStyle === 'film';
    const isDark  = stripStyle === 'black';

    // Film always forces sharp; otherwise respect the roundedEdges setting
    const corners = isFilm ? false : roundedEdges;

    // Background
    const bgColor = isFilm ? 'transparent' : isDark ? '#0f0f0f' : '#ffffff';

    // Padding: film → none, others → depends on timestamp
    const padH  = isFilm ? 0 : 14;
    const padV  = isFilm ? 0 : 14;
    const padBot = isFilm ? 0 : showTimestamp ? 18 : 14;

    // Gap between photos: film → 3px thin seam, others → 10px
    const photoGap = isFilm ? 3 : 10;

    // Timestamp colour
    const stampColor = isDark ? '#b8aa96' : '#9c8575';

    // Show timestamp only for white/black when the user enabled it
    const renderTimestamp = !isFilm && showTimestamp;

    return (
      <div
        ref={ref}
        style={{
          width: 400,
          background: bgColor,
          borderRadius: corners ? 12 : 0,
          paddingTop: padV,
          paddingLeft: padH,
          paddingRight: padH,
          paddingBottom: padBot,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: 0,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Removed nested SVG noise textures due to iOS Safari html-to-image rendering bug */}

        {/* Photos */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: photoGap,
            position: 'relative',
            zIndex: 2,
          }}
        >
          {photos.map((photo, i) => (
            <div
              key={i}
              style={{
                width: '100%',
                aspectRatio: '4/3',
                overflow: 'hidden',
                borderRadius: corners ? 4 : 0,
                flexShrink: 0,
              }}
            >
              <img
                src={photo}
                alt={`Photo ${i + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  filter:
                    colorMode === 'monochrome'
                      ? 'grayscale(100%)'
                      : 'none', // retro is already canvas-processed
                }}
                crossOrigin="anonymous"
              />
            </div>
          ))}
        </div>

        {/* Timestamp — white and black strips only */}
        {renderTimestamp && (
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              marginTop: 12,
              textAlign: 'center',
              fontFamily: "'Special Elite', monospace",
              fontSize: 16,
              color: stampColor,
              letterSpacing: 0.5,
            }}
          >
            {dateStr} · {timeStr}
          </div>
        )}
      </div>
    );
  }
);

PhotoStrip.displayName = 'PhotoStrip';
export default PhotoStrip;

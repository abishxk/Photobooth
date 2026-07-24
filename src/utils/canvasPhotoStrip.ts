import type { ColorMode, StripStyle } from '../types';

/**
 * Detects if the current user agent / device is running iOS or iPadOS.
 */
export const isIOS = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const isIPhoneIPad = /iPad|iPhone|iPod/.test(ua);
  const isIPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  return isIPhoneIPad || isIPadOS;
};

interface GenerateStripOptions {
  photos: string[];
  colorMode: ColorMode;
  showTimestamp?: boolean;
  stripStyle?: StripStyle;
  roundedEdges?: boolean;
}

/**
 * Loads an image from a URL or data URI.
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Helper to draw a rounded rectangle path on a 2D canvas context.
 */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (r <= 0) {
    ctx.rect(x, y, w, h);
    return;
  }
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * Generates a PNG data URL of the photo strip directly using HTML5 2D Canvas.
 * This avoids SVG <foreignObject> canvas rendering issues on iOS Safari.
 */
export async function generateCanvasPhotoStrip(options: GenerateStripOptions): Promise<string> {
  const {
    photos,
    colorMode,
    showTimestamp = false,
    stripStyle = 'white',
    roundedEdges = true,
  } = options;

  const scale = 3; // 3x scale for crisp 1200px width output
  const W = 400 * scale;

  const isFilm = stripStyle === 'film';
  const isDark = stripStyle === 'black';
  const corners = isFilm ? false : roundedEdges;

  const bgColor = isFilm ? null : isDark ? '#0f0f0f' : '#ffffff';
  const padH = (isFilm ? 0 : 14) * scale;
  const padV = (isFilm ? 0 : 14) * scale;
  const renderTimestamp = !isFilm && showTimestamp;
  const padBot = (isFilm ? 0 : renderTimestamp ? 18 : 14) * scale;
  const photoGap = (isFilm ? 3 : 10) * scale;
  const stampColor = isDark ? '#b8aa96' : '#9c8575';

  const photoWidth = W - padH * 2;
  const photoHeight = Math.round((photoWidth * 3) / 4);

  const totalPhotosHeight =
    photos.length > 0
      ? photos.length * photoHeight + (photos.length - 1) * photoGap
      : 0;

  const stampMarginTop = 12 * scale;
  const stampFontSize = 16 * scale;
  const stampHeight = renderTimestamp ? stampMarginTop + stampFontSize + 6 * scale : 0;

  const H = padV + totalPhotosHeight + stampHeight + padBot;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // 1. Draw outer background
  if (bgColor) {
    ctx.save();
    ctx.fillStyle = bgColor;
    if (corners) {
      drawRoundedRect(ctx, 0, 0, W, H, 12 * scale);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, W, H);
    }
    ctx.restore();
  }

  // 2. Preload photos
  const loadedImages = await Promise.all(
    photos.map((url) => loadImage(url).catch(() => null))
  );

  // 3. Draw each photo
  const photoRadius = corners ? 4 * scale : 0;

  for (let i = 0; i < loadedImages.length; i++) {
    const img = loadedImages[i];
    const py = padV + i * (photoHeight + photoGap);
    const px = padH;

    if (!img) continue;

    ctx.save();

    // Clip to rounded rectangle if corners enabled
    if (photoRadius > 0) {
      drawRoundedRect(ctx, px, py, photoWidth, photoHeight, photoRadius);
      ctx.clip();
    }

    // Apply monochrome grayscale filter if needed
    if (colorMode === 'monochrome') {
      ctx.filter = 'grayscale(100%)';
    }

    // Draw photo filled within container (cover fit)
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const boxRatio = photoWidth / photoHeight;

    let sx = 0,
      sy = 0,
      sw = img.naturalWidth,
      sh = img.naturalHeight;

    if (imgRatio > boxRatio) {
      sw = img.naturalHeight * boxRatio;
      sx = (img.naturalWidth - sw) / 2;
    } else {
      sh = img.naturalWidth / boxRatio;
      sy = (img.naturalHeight - sh) / 2;
    }

    ctx.drawImage(img, sx, sy, sw, sh, px, py, photoWidth, photoHeight);

    ctx.restore();
  }

  // 4. Draw Timestamp
  if (renderTimestamp) {
    try {
      if (document.fonts) {
        await document.fonts.ready;
      }
    } catch {
      // Ignore font loading errors if document.fonts is not available
    }

    ctx.save();
    const now = new Date();
    const tz = 'Asia/Kolkata';
    const dateStr = now.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: tz,
    });
    const timeStr = now
      .toLocaleTimeString('en-IN', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: tz,
      })
      .toUpperCase();

    const text = `${dateStr}, ${timeStr}`;

    ctx.fillStyle = stampColor;
    ctx.font = `${stampFontSize}px 'Special Elite', monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.letterSpacing = `${0.5 * scale}px`;

    const stampY = padV + totalPhotosHeight + stampMarginTop;
    ctx.fillText(text, W / 2, stampY);
    ctx.restore();
  }

  const dataUrl = canvas.toDataURL('image/png');

  // Clean up graphics memory
  canvas.width = 0;
  canvas.height = 0;

  return dataUrl;
}

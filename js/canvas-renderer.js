// High-Resolution Photobooth Strip Canvas Renderer
class PhotoboothRenderer {
    constructor() {
        this.frameThemes = {
            'white': { name: 'Pure White', bg: '#ffffff', text: '#18181b', subtext: '#71717a', border: '#e4e4e7' },
            'black': { name: 'Chic Noir', bg: '#18181b', text: '#fafafa', subtext: '#a1a1aa', border: '#27272a' },
            'pink': { name: 'Pastel Rosé', bg: '#ffe4e6', text: '#9f1239', subtext: '#be123c', border: '#fecdd3' },
            'blue': { name: 'Baby Cloud', bg: '#e0f2fe', text: '#075985', subtext: '#0284c7', border: '#bae6fd' },
            'sage': { name: 'Matcha Sage', bg: '#e8f5e9', text: '#1b5e20', subtext: '#2e7d32', border: '#c8e6c9' },
            'butter': { name: 'Sweet Butter', bg: '#fef9c3', text: '#713f12', subtext: '#854d0e', border: '#fef08a' },
            'lavender': { name: 'Lavender Mist', bg: '#f3e8ff', text: '#581c87', subtext: '#7e22ce', border: '#e9d5ff' },
            'retro-beige': { name: 'Vintage Paper', bg: '#f7f2ea', text: '#44403c', subtext: '#78716c', border: '#e7e0d3' },
            'gradient': { name: 'Sunset Dream', gradient: ['#fbcfe8', '#bfdbfe'], text: '#4c1d95', subtext: '#6d28d9', border: '#ffffff' },
            'gradient-peach': { name: 'Peach Sunrise', gradient: ['#fed7aa', '#fbcfe8'], text: '#9f1239', subtext: '#be123c', border: '#ffffff' },
            'gradient-aurora': { name: 'Aurora Mint', gradient: ['#a7f3d0', '#c7d2fe'], text: '#1e3a8a', subtext: '#2563eb', border: '#ffffff' },
            'gradient-cosmic': { name: 'Cosmic Galaxy', gradient: ['#1e1b4b', '#581c87'], text: '#ffffff', subtext: '#e2e8f0', border: '#3b0764' },
            'custom-gradient': { name: 'Custom Gradient', gradient: ['#ff9a9e', '#fecfef'], text: '#9f1239', subtext: '#be123c', border: '#ffffff' }
        };

        this.currentTheme = 'white';
        this.layout = 'strip-4'; // 'strip-4', 'story-9-16', 'double-strip-4', 'grid-4', 'grid-6'
        
        // Read directly from HTML input values so user changes in index.html are instantly applied!
        const titleEl = (typeof document !== 'undefined') ? document.getElementById('inputTitle') : null;
        const subEl = (typeof document !== 'undefined') ? document.getElementById('inputSubtitle') : null;
        this.titleText = titleEl ? titleEl.value : 'MANTRA PEEPS';
        this.subtitleText = subEl ? subEl.value : 'TIMOHO REGION';
        this.customDate = '';
        this.showDate = true;
        this.showBarcode = true;
        this.roundCorners = 8; // rounded corners on photo frames
        this.padding = 24;
        this.gap = 16;
    }

    getLuminance(hex) {
        if (!hex) return 0.5;
        let c = hex.replace('#', '');
        if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
        const rgb = parseInt(c, 16);
        const r = ((rgb >> 16) & 0xff) / 255;
        const g = ((rgb >> 8) & 0xff) / 255;
        const b = (rgb & 0xff) / 255;
        return 0.299 * r + 0.587 * g + 0.114 * b;
    }

    setCustomGradient(color1, color2) {
        const lum1 = this.getLuminance(color1);
        const lum2 = this.getLuminance(color2);
        const avgLum = (lum1 + lum2) / 2;

        const isDarkBg = avgLum < 0.45;
        const textColor = isDarkBg ? '#ffffff' : '#1e1b4b';
        const subtextColor = isDarkBg ? '#cbd5e1' : '#475569';

        this.frameThemes['custom-gradient'] = {
            name: 'Custom Gradient',
            gradient: [color1, color2],
            text: textColor,
            subtext: subtextColor,
            border: isDarkBg ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
        };
        this.currentTheme = 'custom-gradient';
    }

    getFormattedDate() {
        if (this.customDate) return this.customDate;
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        return `${y}.${m}.${d}`;
    }

    // Measure dimensions for a given layout
    getLayoutDimensions(layout = this.layout, scale = 1) {
        // Base width of single strip column: 420px
        if (layout === 'strip-4') {
            const w = 420;
            // Wider photo slots (approx 16:10.5) so group photos with friends don't get cut on the sides!
            const photoW = w - this.padding * 2;
            const photoH = Math.round(photoW * 0.65);
            const totalH = this.padding + 50 + (photoH * 4) + (this.gap * 3) + 120 + this.padding;
            return { width: Math.round(w * scale), height: Math.round(totalH * scale), photoW: photoW * scale, photoH: photoH * scale, cols: 1, rows: 4 };
        } else if (layout === 'story-9-16') {
            // 9:16 Story format (Base 540x960, scale=2 produces exact 1080x1920 px)
            const w = 540;
            const h = 960;
            const padX = 48;
            const photoW = w - padX * 2; // 444
            const topMargin = 72;
            const bottomMargin = 140;
            const gaps = 14 * 3; // 42
            const photoH = Math.round((h - topMargin - bottomMargin - gaps) / 4); // ~176
            return { 
                width: Math.round(w * scale), 
                height: Math.round(h * scale), 
                photoW: photoW * scale, 
                photoH: photoH * scale, 
                cols: 1, 
                rows: 4, 
                isStory: true,
                topMargin: topMargin * scale,
                bottomMargin: bottomMargin * scale,
                padX: padX * scale,
                gap: 14 * scale
            };
        } else if (layout === 'double-strip-4') {
            const single = this.getLayoutDimensions('strip-4', 1);
            const w = (single.width * 2) + 20; // with center cut guide line
            return { width: Math.round(w * scale), height: Math.round(single.height * scale), photoW: single.photoW * scale, photoH: single.photoH * scale, cols: 2, rows: 4, isDouble: true };
        } else if (layout === 'grid-4') {
            // 2x2 grid
            const w = 680;
            const photoW = (w - (this.padding * 2) - this.gap) / 2;
            const photoH = Math.round(photoW * 0.75);
            const totalH = this.padding + 50 + (photoH * 2) + this.gap + 110 + this.padding;
            return { width: Math.round(w * scale), height: Math.round(totalH * scale), photoW: photoW * scale, photoH: photoH * scale, cols: 2, rows: 2 };
        } else if (layout === 'grid-6') {
            // 2x3 grid
            const w = 680;
            const photoW = (w - (this.padding * 2) - this.gap) / 2;
            const photoH = Math.round(photoW * 0.75);
            const totalH = this.padding + 50 + (photoH * 3) + (this.gap * 2) + 110 + this.padding;
            return { width: Math.round(w * scale), height: Math.round(totalH * scale), photoW: photoW * scale, photoH: photoH * scale, cols: 2, rows: 3 };
        }
        return { width: 420 * scale, height: 1400 * scale, photoW: 372 * scale, photoH: 279 * scale, cols: 1, rows: 4 };
    }

    // Helper to draw a realistic cute aesthetic barcode
    drawBarcode(ctx, x, y, width, height, color) {
        ctx.save();
        ctx.fillStyle = color;
        const barPatterns = [2, 1, 3, 1, 1, 4, 2, 1, 3, 2, 1, 2, 4, 1, 2, 3, 1, 1, 2, 3, 2, 1, 3, 1];
        let currentX = x;
        const totalUnits = barPatterns.reduce((a, b) => a + b, 0) + (barPatterns.length - 1);
        const unitWidth = width / totalUnits;

        barPatterns.forEach((pattern, i) => {
            if (i % 2 === 0) {
                const w = pattern * unitWidth;
                ctx.fillRect(currentX, y, w, height);
            }
            currentX += (pattern + 1) * unitWidth;
        });
        ctx.restore();
    }

    // Render entire strip onto an HTML5 Canvas
    async render(canvas, photos = [], stickerManager = null, scale = 1) {
        const dims = this.getLayoutDimensions(this.layout, scale);
        canvas.width = dims.width;
        canvas.height = dims.height;

        const ctx = canvas.getContext('2d');
        const theme = this.frameThemes[this.currentTheme] || this.frameThemes['white'];

        // 1. Fill Frame Background
        ctx.save();
        if (theme.gradient) {
            const grad = ctx.createLinearGradient(0, 0, dims.width, dims.height);
            grad.addColorStop(0, theme.gradient[0]);
            grad.addColorStop(1, theme.gradient[1]);
            ctx.fillStyle = grad;
        } else {
            ctx.fillStyle = theme.bg;
        }
        ctx.fillRect(0, 0, dims.width, dims.height);
        ctx.restore();

        // If double strip, render cut indicator in center
        if (dims.isDouble) {
            ctx.save();
            ctx.strokeStyle = theme.subtext;
            ctx.setLineDash([6 * scale, 6 * scale]);
            ctx.lineWidth = 1 * scale;
            const midX = dims.width / 2;
            ctx.beginPath();
            ctx.moveTo(midX, 20 * scale);
            ctx.lineTo(midX, dims.height - 20 * scale);
            ctx.stroke();

            // Little scissor icon emoji
            ctx.font = `${14 * scale}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('✂️', midX, 16 * scale);
            ctx.restore();
        }

        // Draw Single Column Strip or Columns
        const columns = dims.isDouble ? 2 : 1;
        const colWidth = dims.isDouble ? (dims.width - 20 * scale) / 2 : dims.width;

        for (let col = 0; col < columns; col++) {
            const colOffsetX = col * (colWidth + 20 * scale);

            // 2. Draw Top Header
            ctx.save();
            ctx.fillStyle = theme.text;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const headerFontSize = dims.isStory ? 18 * scale : 15 * scale;
            ctx.font = `800 ${headerFontSize}px 'Plus Jakarta Sans', sans-serif`;
            ctx.letterSpacing = `${2 * scale}px`;
            const headerY = dims.isStory 
                ? (38 * scale) 
                : (colOffsetX >= 0 ? (this.padding * scale + 16 * scale) : 0);
            ctx.fillText(this.titleText.toUpperCase(), colOffsetX + colWidth / 2, headerY);
            ctx.restore();

            // 3. Render Photo Grid / Strip
            const startY = dims.isStory ? dims.topMargin : (this.padding + 38) * scale;
            const padX = dims.isStory ? dims.padX : this.padding * scale;
            const photoW = dims.photoW;
            const photoH = dims.photoH;
            const gap = dims.isStory ? dims.gap : (this.gap * scale);
            const cornerRadius = (dims.isStory ? 10 : this.roundCorners) * scale;

            let photoIndex = 0;
            for (let r = 0; r < dims.rows; r++) {
                for (let c = 0; c < (dims.isDouble ? 1 : dims.cols); c++) {
                    const currentPhoto = photos[photoIndex % photos.length];
                    const px = colOffsetX + padX + (c * (photoW + gap));
                    const py = startY + (r * (photoH + gap));

                    // Frame slot background placeholder
                    ctx.save();
                    ctx.fillStyle = '#f1f5f9';
                    this.roundRect(ctx, px, py, photoW, photoH, cornerRadius);
                    ctx.fill();

                    // If photo exists, draw it inside rounded clip
                    if (currentPhoto) {
                        const img = await this.loadImage(currentPhoto);
                        if (img) {
                            ctx.save();
                            this.roundRect(ctx, px, py, photoW, photoH, cornerRadius);
                            ctx.clip();
                            this.drawCoverImage(ctx, img, px, py, photoW, photoH);
                            ctx.restore();
                        }
                    } else {
                        // Empty slot indicator
                        ctx.fillStyle = '#94a3b8';
                        ctx.font = `600 ${16 * scale}px 'Plus Jakarta Sans', sans-serif`;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(`Slot ${photoIndex + 1}`, px + photoW / 2, py + photoH / 2);
                    }

                    // Delicate inner photo border
                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
                    ctx.lineWidth = 1 * scale;
                    this.roundRect(ctx, px, py, photoW, photoH, cornerRadius);
                    ctx.stroke();
                    ctx.restore();

                    photoIndex++;
                }
            }

            // 4. Draw Bottom Section (Date, Barcode, Subtitle, Heart)
            const bottomStartY = dims.isStory
                ? (startY + (dims.rows * photoH) + ((dims.rows - 1) * gap) + 16 * scale)
                : (startY + (dims.rows * photoH) + ((dims.rows - 1) * gap) + (20 * scale));
            const centerX = colOffsetX + colWidth / 2;

            ctx.save();
            ctx.fillStyle = theme.subtext;
            ctx.textAlign = 'center';
            const subFontSize = dims.isStory ? 12 * scale : 11 * scale;
            ctx.font = `600 ${subFontSize}px 'Plus Jakarta Sans', sans-serif`;
            ctx.letterSpacing = `${1.5 * scale}px`;
            ctx.fillText(this.subtitleText, centerX, bottomStartY + (10 * scale));

            if (this.showDate) {
                ctx.fillStyle = theme.text;
                const dateFontSize = dims.isStory ? 15 * scale : 14 * scale;
                ctx.font = `700 ${dateFontSize}px 'Plus Jakarta Sans', monospace`;
                ctx.fillText(this.getFormattedDate(), centerX, bottomStartY + (dims.isStory ? 34 : 32) * scale);
            }

            if (this.showBarcode) {
                const bcWidth = (dims.isStory ? 150 : 120) * scale;
                const bcHeight = (dims.isStory ? 24 : 22) * scale;
                this.drawBarcode(ctx, centerX - bcWidth / 2, bottomStartY + (dims.isStory ? 48 : 44) * scale, bcWidth, bcHeight, theme.text);
            }

            // Cute small logo or heart at very bottom
            ctx.font = `${(dims.isStory ? 11 : 10) * scale}px sans-serif`;
            ctx.fillStyle = theme.subtext;
            ctx.fillText('♥ STUDIO PHOTOBOOTH ♥', centerX, bottomStartY + (dims.isStory ? 88 : 82) * scale);
            ctx.restore();
        }

        // 5. Render Stickers on Top
        if (stickerManager) {
            stickerManager.renderToCanvas(ctx, scale);
        }
    }

    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    drawCoverImage(ctx, img, px, py, targetW, targetH) {
        const imgRatio = img.width / img.height;
        const targetRatio = targetW / targetH;
        let sW, sH, sX, sY;

        if (imgRatio > targetRatio) {
            // Image is wider than target slot: crop left & right
            sH = img.height;
            sW = img.height * targetRatio;
            sX = (img.width - sW) / 2;
            sY = 0;
        } else {
            // Image is taller than target slot: crop top & bottom
            sW = img.width;
            sH = img.width / targetRatio;
            sX = 0;
            sY = (img.height - sH) / 2;
        }
        ctx.drawImage(img, sX, sY, sW, sH, px, py, targetW, targetH);
    }

    loadImage(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = src;
        });
    }
}

window.PhotoboothRenderer = PhotoboothRenderer;

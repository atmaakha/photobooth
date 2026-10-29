// Interactive Sticker System
const STICKER_COLLECTION = [
    { id: 'bow', type: 'emoji', text: '🎀', label: 'Ribbon' },
    { id: 'sparkles', type: 'emoji', text: '✨', label: 'Sparkles' },
    { id: 'heart', type: 'emoji', text: '💖', label: 'Pink Heart' },
    { id: 'bunny', type: 'emoji', text: '🐰', label: 'Bunny' },
    { id: 'cat', type: 'emoji', text: '🐱', label: 'Kitty' },
    { id: 'cherries', type: 'emoji', text: '🍒', label: 'Cherries' },
    { id: 'star', type: 'emoji', text: '⭐', label: 'Star' },
    { id: 'sun', type: 'emoji', text: '🌻', label: 'Sunflower' },
    { id: 'strawberry', type: 'emoji', text: '🍓', label: 'Strawberry' },
    { id: 'bear', type: 'emoji', text: '🧸', label: 'Teddy Bear' },
    { id: 'glasses', type: 'emoji', text: '🕶️', label: 'Glasses' },
    { id: 'crown', type: 'emoji', text: '👑', label: 'Crown' },
    { id: 'flower', type: 'emoji', text: '🌸', label: 'Cherry Blossom' },
    { id: 'butterfly', type: 'emoji', text: '🦋', label: 'Butterfly' },
    { id: 'fire', type: 'emoji', text: '🔥', label: 'Fire' },
    { id: 'paw', type: 'emoji', text: '🐾', label: 'Paw' },
    { id: 'badge1', type: 'badge', text: 'CUTE! 💕', bg: '#ffe4e6', color: '#e11d48' },
    { id: 'badge2', type: 'badge', text: 'BESTIES 👯', bg: '#fef08a', color: '#854d0e' },
    { id: 'badge3', type: 'badge', text: 'PHOTOBOOTH 📸', bg: '#e0e7ff', color: '#3730a3' },
    { id: 'badge4', type: 'badge', text: 'XOXO 💋', bg: '#fbcfe8', color: '#9d174d' },
    { id: 'badge5', type: 'badge', text: 'STARRY NIGHT ✨', bg: '#1e293b', color: '#f8fafc' }
];

class StickerManager {
    constructor() {
        this.stickers = []; // active stickers on strip { id, stickerDef, x, y, size, rotation }
        this.selectedStickerIndex = -1;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
    }

    addSticker(stickerDef, containerWidth = 400, containerHeight = 1200) {
        const newSticker = {
            id: 'stk_' + Date.now() + Math.random().toString(36).substr(2, 4),
            def: stickerDef,
            x: containerWidth * 0.5 + (Math.random() * 60 - 30),
            y: containerHeight * 0.4 + (Math.random() * 80 - 40),
            size: stickerDef.type === 'badge' ? 120 : 54,
            rotation: (Math.random() * 20 - 10) * (Math.PI / 180)
        };
        this.stickers.push(newSticker);
        this.selectedStickerIndex = this.stickers.length - 1;
        return newSticker;
    }

    removeSelected() {
        if (this.selectedStickerIndex >= 0 && this.selectedStickerIndex < this.stickers.length) {
            this.stickers.splice(this.selectedStickerIndex, 1);
            this.selectedStickerIndex = -1;
            return true;
        }
        return false;
    }

    clearAll() {
        this.stickers = [];
        this.selectedStickerIndex = -1;
    }

    rotateSelected(degDelta) {
        if (this.selectedStickerIndex >= 0) {
            this.stickers[this.selectedStickerIndex].rotation += degDelta * (Math.PI / 180);
        }
    }

    scaleSelected(scaleMultiplier) {
        if (this.selectedStickerIndex >= 0) {
            const stk = this.stickers[this.selectedStickerIndex];
            stk.size = Math.max(24, Math.min(220, stk.size * scaleMultiplier));
        }
    }

    renderToCanvas(ctx, scale = 1) {
        this.stickers.forEach((stk, index) => {
            ctx.save();
            const posX = stk.x * scale;
            const posY = stk.y * scale;
            const size = stk.size * scale;

            ctx.translate(posX, posY);
            ctx.rotate(stk.rotation);

            if (stk.def.type === 'emoji') {
                ctx.font = `${Math.round(size)}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                // Subtle drop shadow for cute 3D effect
                ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
                ctx.shadowBlur = 6 * scale;
                ctx.shadowOffsetY = 3 * scale;
                ctx.fillText(stk.def.text, 0, 0);
            } else if (stk.def.type === 'badge') {
                const text = stk.def.text;
                const fontSize = Math.round(size * 0.28);
                ctx.font = `bold ${fontSize}px 'Plus Jakarta Sans', sans-serif`;
                const textMetrics = ctx.measureText(text);
                const padX = 14 * scale;
                const padY = 8 * scale;
                const boxW = textMetrics.width + padX * 2;
                const boxH = fontSize + padY * 2;

                // Pill background
                ctx.fillStyle = stk.def.bg || '#ffe4e6';
                ctx.shadowColor = 'rgba(0,0,0,0.15)';
                ctx.shadowBlur = 8 * scale;
                ctx.shadowOffsetY = 3 * scale;
                
                // Rounded rect
                const r = boxH / 2;
                ctx.beginPath();
                ctx.roundRect(-boxW / 2, -boxH / 2, boxW, boxH, r);
                ctx.fill();

                // Border
                ctx.strokeStyle = stk.def.color || '#e11d48';
                ctx.lineWidth = 1.5 * scale;
                ctx.stroke();

                // Text
                ctx.shadowColor = 'transparent';
                ctx.fillStyle = stk.def.color || '#e11d48';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(text, 0, 0);
            }

            // If selected, draw delicate bounding indicator
            if (index === this.selectedStickerIndex && scale === 1) {
                ctx.strokeStyle = '#f43f5e';
                ctx.lineWidth = 1.5;
                ctx.setLineDash([4, 4]);
                const boxRadius = size * 0.65;
                ctx.strokeRect(-boxRadius, -boxRadius, boxRadius * 2, boxRadius * 2);
                ctx.setLineDash([]);
            }

            ctx.restore();
        });
    }
}

window.StickerManager = StickerManager;
window.STICKER_COLLECTION = STICKER_COLLECTION;

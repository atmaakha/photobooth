// Camera & Canvas Filters System
const FILTERS = {
    'normal': {
        name: 'Natural',
        css: 'none',
        canvasFilter: 'none',
        colorTone: null
    },
    'soft-glow': {
        name: 'Soft Glow ✨',
        css: 'brightness(1.06) contrast(0.96) saturate(1.12)',
        canvasFilter: 'brightness(106%) contrast(96%) saturate(112%)',
        colorTone: 'rgba(255, 235, 240, 0.08)' // Subtle pink pearl glow
    },
    'warm-film': {
        name: 'Warm Film 🎞️',
        css: 'sepia(0.25) contrast(1.12) brightness(1.02) saturate(1.1)',
        canvasFilter: 'sepia(25%) contrast(112%) brightness(102%) saturate(110%)',
        colorTone: 'rgba(255, 210, 150, 0.12)' // Golden warm tint
    },
    'classic-bw': {
        name: 'Classic B&W 🖤',
        css: 'grayscale(1) contrast(1.25) brightness(0.98)',
        canvasFilter: 'grayscale(100%) contrast(125%) brightness(98%)',
        colorTone: null
    },
    'vintage-rose': {
        name: 'Rosy Pastel 🌸',
        css: 'saturate(1.25) contrast(1.05) brightness(1.04) hue-rotate(-8deg)',
        canvasFilter: 'saturate(125%) contrast(105%) brightness(104%) hue-rotate(-8deg)',
        colorTone: 'rgba(255, 180, 200, 0.14)'
    },
    'y2k-cool': {
        name: 'Y2K Dream 🪩',
        css: 'contrast(1.15) brightness(1.05) saturate(1.2) hue-rotate(15deg)',
        canvasFilter: 'contrast(115%) brightness(105%) saturate(120%) hue-rotate(15deg)',
        colorTone: 'rgba(160, 220, 255, 0.1)'
    },
    'moody-noir': {
        name: 'Moody Noir 🎬',
        css: 'grayscale(1) contrast(1.45) brightness(0.9)',
        canvasFilter: 'grayscale(100%) contrast(145%) brightness(90%)',
        colorTone: 'rgba(20, 20, 30, 0.15)'
    },
    'pink-love': {
        name: 'Pink Love 💕',
        css: 'brightness(1.05) contrast(1.02) saturate(1.18)',
        canvasFilter: 'brightness(105%) contrast(102%) saturate(118%)',
        colorTone: 'rgba(255, 180, 205, 0.12)',
        isAR: true
    },
    'cat-ears': {
        name: 'Telinga Kucing 🐱',
        css: 'brightness(1.06) contrast(1.03) saturate(1.15)',
        canvasFilter: 'brightness(106%) contrast(103%) saturate(115%)',
        colorTone: 'rgba(255, 230, 240, 0.09)',
        isAR: true
    }
};

class FilterManager {
    constructor() {
        this.currentFilter = 'soft-glow';
        this.addGrain = true;
    }

    setFilter(filterKey, videoElement) {
        if (!FILTERS[filterKey]) return;
        this.currentFilter = filterKey;
        if (videoElement) {
            videoElement.style.filter = FILTERS[filterKey].css;
        }
        if (window.faceTracker) {
            if (FILTERS[filterKey].isAR) {
                window.faceTracker.setFilterType(filterKey);
                window.faceTracker.start();
            } else {
                window.faceTracker.stop();
            }
        }
    }

    applyToCanvas(ctx, width, height, filterKey = this.currentFilter, withGrain = this.addGrain) {
        const filter = FILTERS[filterKey] || FILTERS['normal'];

        // Overlay delicate color grading tone if specified
        if (filter.colorTone) {
            ctx.save();
            ctx.fillStyle = filter.colorTone;
            ctx.globalCompositeOperation = 'soft-light';
            ctx.fillRect(0, 0, width, height);
            ctx.restore();
        }

        // Add subtle film grain if enabled
        if (withGrain) {
            this.applyFilmGrain(ctx, width, height);
        }
    }

    applyFilmGrain(ctx, width, height) {
        ctx.save();
        const grainCanvas = document.createElement('canvas');
        grainCanvas.width = 120;
        grainCanvas.height = 120;
        const gCtx = grainCanvas.getContext('2d');
        const imgData = gCtx.createImageData(120, 120);
        const buffer = new Uint32Array(imgData.data.buffer);

        for (let i = 0; i < buffer.length; i++) {
            if (Math.random() < 0.25) {
                const val = Math.floor(Math.random() * 255);
                buffer[i] = (25 << 24) | (val << 16) | (val << 8) | val;
            }
        }
        gCtx.putImageData(imgData, 0, 0);

        ctx.globalAlpha = 0.35;
        ctx.globalCompositeOperation = 'overlay';
        ctx.fillStyle = ctx.createPattern(grainCanvas, 'repeat');
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
    }
}

window.filterManager = new FilterManager();

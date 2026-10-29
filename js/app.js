// Main Application Controller
class PhotoboothApp {
    constructor() {
        this.camera = null;
        this.renderer = new PhotoboothRenderer();
        this.stickerManager = new StickerManager();
        
        this.capturedPhotos = [];
        this.targetPhotoCount = 4;
        this.isShooting = false;
        this.countdownTimer = 3; // default 3s
        this.guideOverlayVisible = false;
        this.history = [];

        this.initElements();
        this.initEvents();
        this.loadHistory();
    }

    initElements() {
        this.video = document.getElementById('cameraVideo');
        this.stripCanvas = document.getElementById('stripCanvas');
        this.camera = new CameraController(this.video);

        // Flash & Countdown elements
        this.flashOverlay = document.getElementById('cameraFlash');
        this.countdownOverlay = document.getElementById('countdownOverlay');
        this.countdownNumber = document.getElementById('countdownNumber');
        this.shotProgressBadge = document.getElementById('shotProgressBadge');
        this.shotProgressText = document.getElementById('shotProgressText');

        // Buttons
        this.btnStartShoot = document.getElementById('btnStartShoot');
        this.btnRetakeAll = document.getElementById('btnRetakeAll');
        this.btnSingleSnap = document.getElementById('btnSingleSnap');
        this.btnDownload = document.getElementById('btnDownload');
        this.btnPrint = document.getElementById('btnPrint');
        this.btnCopy = document.getElementById('btnCopy');
        this.btnToggleMirror = document.getElementById('btnToggleMirror');
        this.btnToggleGrid = document.getElementById('btnToggleGrid');
        this.btnToggleSound = document.getElementById('btnToggleSound');
        this.cameraSelect = document.getElementById('cameraSelect');

        // Dark Mode elements
        this.btnToggleDark = document.getElementById('btnToggleDark');
        this.darkIcon = document.getElementById('darkIcon');
        this.darkText = document.getElementById('darkText');

        // Text customizer
        this.inputTitle = document.getElementById('inputTitle');
        this.inputSubtitle = document.getElementById('inputSubtitle');
        this.inputDate = document.getElementById('inputDate');
        this.chkBarcode = document.getElementById('chkBarcode');
        this.chkDate = document.getElementById('chkDate');
    }

    async init() {
        // Initialize camera
        const res = await this.camera.startCamera();
        if (!res.success) {
            this.showToast(res.error, 'error');
        }

        // Initialize Face Tracker for AR Filters
        const arCanvas = document.getElementById('arCanvas');
        if (window.faceTracker && arCanvas) {
            window.faceTracker.init(this.video, arCanvas);
        }

        // Populate camera list
        const devices = await this.camera.getDevices();
        if (devices.length > 0 && this.cameraSelect) {
            this.cameraSelect.innerHTML = devices.map((d, i) => 
                `<option value="${d.deviceId}">${d.label || `Kamera ${i + 1}`}</option>`
            ).join('');
        }

        // Set default filter
        window.filterManager.setFilter('soft-glow', this.video);

        // Initialize Dark Mode
        this.initDarkMode();

        // Sync text from HTML input fields (reads whatever is set in index.html!)
        this.syncTextFromInputs();

        // Render initial canvas preview
        this.renderCanvas();
    }

    initDarkMode() {
        const isDark = document.documentElement.classList.contains('dark') || localStorage.getItem('photobooth_dark_mode') === 'true';
        if (typeof window.updateDarkUI === 'function') {
            window.updateDarkUI(isDark);
        }
    }

    syncTextFromInputs() {
        if (this.inputTitle) {
            this.renderer.titleText = this.inputTitle.value || 'PHOTO STUDIO';
        }
        if (this.inputSubtitle) {
            this.renderer.subtitleText = this.inputSubtitle.value || '';
        }
        if (this.inputDate) {
            this.renderer.customDate = this.inputDate.value || '';
        }
        if (this.chkBarcode) {
            this.renderer.showBarcode = this.chkBarcode.checked;
        }
        if (this.chkDate) {
            this.renderer.showDate = this.chkDate.checked;
        }
    }

    initEvents() {
        // Start Shoot Sequence
        this.btnStartShoot.addEventListener('click', () => {
            window.soundEffects.init();
            this.startPhotoSequence();
        });

        // Single Snap
        this.btnSingleSnap.addEventListener('click', () => {
            window.soundEffects.init();
            this.captureSingle();
        });

        // Retake
        this.btnRetakeAll.addEventListener('click', () => {
            this.capturedPhotos = [];
            this.updateShotSlots();
            this.renderCanvas();
            this.showToast('Foto dibersihkan, siap berfoto lagi!', 'info');
        });

        // Mirror Toggle
        this.btnToggleMirror.addEventListener('click', () => {
            const isMirrored = this.camera.toggleMirror();
            this.showToast(isMirrored ? 'Mode Cermin Aktif 🪞' : 'Mode Normal 📷', 'info');
        });

        // Grid Guide Toggle
        this.btnToggleGrid.addEventListener('click', () => {
            this.guideOverlayVisible = !this.guideOverlayVisible;
            document.getElementById('gridGuide').style.display = this.guideOverlayVisible ? 'grid' : 'none';
        });

        // Sound Toggle
        this.btnToggleSound.addEventListener('click', () => {
            window.soundEffects.muted = !window.soundEffects.muted;
            this.btnToggleSound.innerHTML = window.soundEffects.muted ? '🔇' : '🔊';
        });

        // Camera select change
        if (this.cameraSelect) {
            this.cameraSelect.addEventListener('change', (e) => {
                this.camera.startCamera(e.target.value);
            });
        }

        // Countdown timer options
        document.querySelectorAll('.timer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.timer-btn').forEach(b => b.classList.remove('bg-rose-500', 'text-white'));
                btn.classList.add('bg-rose-500', 'text-white');
                this.countdownTimer = parseInt(btn.dataset.time);
            });
        });

        // Filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active', 'border-rose-500'));
                btn.classList.add('active', 'border-rose-500');
                const filterKey = btn.dataset.filter;
                window.filterManager.setFilter(filterKey, this.video);
                this.renderCanvas();
            });
        });

        // Layouts
        document.querySelectorAll('.layout-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.layout-btn').forEach(b => b.classList.remove('active', 'border-rose-500'));
                btn.classList.add('active', 'border-rose-500');
                this.renderer.layout = btn.dataset.layout;
                this.targetPhotoCount = parseInt(btn.dataset.photos) || 4;
                this.updateShotSlots();
                this.renderCanvas();
            });
        });

        // Frame Themes
        document.querySelectorAll('.color-circle').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.color-circle').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderer.currentTheme = btn.dataset.theme;
                this.renderCanvas();
            });
        });

        // Text & Customization Inputs
        this.inputTitle.addEventListener('input', (e) => {
            this.renderer.titleText = e.target.value || 'PHOTO STUDIO';
            this.renderCanvas();
        });

        this.inputSubtitle.addEventListener('input', (e) => {
            this.renderer.subtitleText = e.target.value;
            this.renderCanvas();
        });

        this.inputDate.addEventListener('input', (e) => {
            this.renderer.customDate = e.target.value;
            this.renderCanvas();
        });

        this.chkBarcode.addEventListener('change', (e) => {
            this.renderer.showBarcode = e.target.checked;
            this.renderCanvas();
        });

        this.chkDate.addEventListener('change', (e) => {
            this.renderer.showDate = e.target.checked;
            this.renderCanvas();
        });

        // Sticker Drawer
        this.initStickerControls();

        // Canvas Interactive Drag & Drop
        this.initCanvasInteractions();

        // Actions
        this.btnDownload.addEventListener('click', () => this.downloadHighRes());
        this.btnPrint.addEventListener('click', () => window.print());
        this.btnCopy.addEventListener('click', () => this.copyToClipboard());
    }

    initStickerControls() {
        const stickerPalette = document.getElementById('stickerPalette');
        if (stickerPalette) {
            stickerPalette.innerHTML = STICKER_COLLECTION.map(stk => `
                <button class="sticker-item p-2 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-2xl flex items-center justify-center cursor-pointer select-none transition" data-id="${stk.id}">
                    ${stk.type === 'emoji' ? stk.text : `<span class="text-xs px-2 py-0.5 rounded-full font-bold" style="background:${stk.bg};color:${stk.color}">${stk.text}</span>`}
                </button>
            `).join('');

            stickerPalette.querySelectorAll('.sticker-item').forEach(btn => {
                btn.addEventListener('click', () => {
                    const stkDef = STICKER_COLLECTION.find(s => s.id === btn.dataset.id);
                    if (stkDef) {
                        const dims = this.renderer.getLayoutDimensions(this.renderer.layout, 1);
                        this.stickerManager.addSticker(stkDef, dims.width, dims.height);
                        this.renderCanvas();
                        this.updateStickerActionButtons();
                    }
                });
            });
        }

        // Sticker transform buttons
        const btnRotateStk = document.getElementById('btnRotateSticker');
        const btnScaleUpStk = document.getElementById('btnScaleUpSticker');
        const btnScaleDownStk = document.getElementById('btnScaleDownSticker');
        const btnDeleteStk = document.getElementById('btnDeleteSticker');
        const btnClearAllStk = document.getElementById('btnClearAllStickers');

        if (btnRotateStk) btnRotateStk.addEventListener('click', () => { this.stickerManager.rotateSelected(15); this.renderCanvas(); });
        if (btnScaleUpStk) btnScaleUpStk.addEventListener('click', () => { this.stickerManager.scaleSelected(1.15); this.renderCanvas(); });
        if (btnScaleDownStk) btnScaleDownStk.addEventListener('click', () => { this.stickerManager.scaleSelected(0.85); this.renderCanvas(); });
        if (btnDeleteStk) btnDeleteStk.addEventListener('click', () => { this.stickerManager.removeSelected(); this.renderCanvas(); this.updateStickerActionButtons(); });
        if (btnClearAllStk) btnClearAllStk.addEventListener('click', () => { this.stickerManager.clearAll(); this.renderCanvas(); this.updateStickerActionButtons(); });
    }

    updateStickerActionButtons() {
        const hasSelection = this.stickerManager.selectedStickerIndex >= 0;
        const transformGroup = document.getElementById('stickerTransformControls');
        if (transformGroup) {
            transformGroup.style.opacity = hasSelection ? '1' : '0.4';
            transformGroup.style.pointerEvents = hasSelection ? 'auto' : 'none';
        }
    }

    initCanvasInteractions() {
        let isDown = false;
        let activeIndex = -1;

        const getCanvasCoord = (e) => {
            const rect = this.stripCanvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const scaleX = this.stripCanvas.width / rect.width;
            const scaleY = this.stripCanvas.height / rect.height;
            return {
                x: (clientX - rect.left) * scaleX,
                y: (clientY - rect.top) * scaleY
            };
        };

        const handleStart = (e) => {
            const pos = getCanvasCoord(e);
            // Check in reverse (topmost sticker first)
            for (let i = this.stickerManager.stickers.length - 1; i >= 0; i--) {
                const stk = this.stickerManager.stickers[i];
                const dx = pos.x - stk.x;
                const dy = pos.y - stk.y;
                const dist = Math.hypot(dx, dy);
                if (dist <= stk.size * 0.7) {
                    isDown = true;
                    activeIndex = i;
                    this.stickerManager.selectedStickerIndex = i;
                    this.stickerManager.dragOffset = { x: dx, y: dy };
                    this.updateStickerActionButtons();
                    this.renderCanvas();
                    return;
                }
            }
            // Clicked background -> deselect
            this.stickerManager.selectedStickerIndex = -1;
            this.updateStickerActionButtons();
            this.renderCanvas();
        };

        const handleMove = (e) => {
            if (!isDown || activeIndex < 0) return;
            const pos = getCanvasCoord(e);
            const stk = this.stickerManager.stickers[activeIndex];
            if (stk) {
                stk.x = pos.x - this.stickerManager.dragOffset.x;
                stk.y = pos.y - this.stickerManager.dragOffset.y;
                this.renderCanvas();
            }
        };

        const handleEnd = () => {
            isDown = false;
        };

        this.stripCanvas.addEventListener('mousedown', handleStart);
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleEnd);

        this.stripCanvas.addEventListener('touchstart', handleStart, { passive: true });
        window.addEventListener('touchmove', handleMove, { passive: true });
        window.addEventListener('touchend', handleEnd);
    }

    async renderCanvas() {
        if (!this.stripCanvas) return;
        this.syncTextFromInputs();
        await this.renderer.render(this.stripCanvas, this.capturedPhotos, this.stickerManager, 1);
    }

    async startPhotoSequence() {
        if (this.isShooting) return;
        this.isShooting = true;
        this.btnStartShoot.disabled = true;
        this.capturedPhotos = [];
        this.updateShotSlots();

        for (let i = 0; i < this.targetPhotoCount; i++) {
            this.shotProgressBadge.classList.remove('hidden');
            this.shotProgressText.innerText = `Foto ${i + 1} dari ${this.targetPhotoCount}`;

            // Countdown
            await this.runCountdown(this.countdownTimer);

            // Shutter Flash & Audio
            this.triggerFlash();
            window.soundEffects.playShutter();

            // Snap photo (captures full camera width without cutting off friends on sides!)
            const photoUrl = this.camera.captureFrame();
            if (photoUrl) {
                this.capturedPhotos.push(photoUrl);
                this.updateShotSlots();
                await this.renderCanvas();
            }

            // Brief pause between shots
            if (i < this.targetPhotoCount - 1) {
                await new Promise(r => setTimeout(r, 1200));
            }
        }

        this.shotProgressBadge.classList.add('hidden');
        this.isShooting = false;
        this.btnStartShoot.disabled = false;

        // Fanfare sound
        window.soundEffects.playSuccessChime();
        this.saveToHistory();
        this.showToast('Photobooth strip selesai! Yuk hias dengan stiker ✨', 'success');
    }

    async captureSingle() {
        if (this.isShooting) return;
        this.isShooting = true;

        await this.runCountdown(this.countdownTimer);
        this.triggerFlash();
        window.soundEffects.playShutter();

        const photoUrl = this.camera.captureFrame();
        if (photoUrl) {
            if (this.capturedPhotos.length >= this.targetPhotoCount) {
                this.capturedPhotos.shift();
            }
            this.capturedPhotos.push(photoUrl);
            this.updateShotSlots();
            await this.renderCanvas();
        }

        this.isShooting = false;
        this.showToast('Foto ditambahkan!', 'success');
    }

    runCountdown(seconds) {
        return new Promise((resolve) => {
            let remaining = seconds;
            this.countdownOverlay.classList.remove('hidden');

            const tick = () => {
                if (remaining > 0) {
                    this.countdownNumber.innerText = remaining;
                    window.soundEffects.playCountdownBeep(remaining === 1);
                    remaining--;
                    setTimeout(tick, 1000);
                } else {
                    this.countdownOverlay.classList.add('hidden');
                    resolve();
                }
            };
            tick();
        });
    }

    triggerFlash() {
        this.flashOverlay.classList.add('active');
        setTimeout(() => {
            this.flashOverlay.classList.remove('active');
        }, 150);
    }

    updateShotSlots() {
        const slotsContainer = document.getElementById('photoSlotsContainer');
        if (!slotsContainer) return;

        slotsContainer.innerHTML = '';
        for (let i = 0; i < this.targetPhotoCount; i++) {
            const photo = this.capturedPhotos[i];
            const div = document.createElement('div');
            div.className = `relative rounded-xl overflow-hidden aspect-[4/3] border-2 flex items-center justify-center ${
                photo ? 'border-rose-400 bg-black' : 'border-dashed border-slate-300 bg-slate-50'
            }`;

            if (photo) {
                div.innerHTML = `
                    <img src="${photo}" class="w-full h-full object-cover">
                    <button class="absolute top-1 right-1 bg-black/60 hover:bg-rose-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs transition" title="Hapus foto ini" onclick="app.removePhoto(${i})">✕</button>
                    <span class="absolute bottom-1 left-1.5 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold">#${i + 1}</span>
                `;
            } else {
                div.innerHTML = `<span class="text-xs font-semibold text-slate-400">Slot ${i + 1}</span>`;
            }
            slotsContainer.appendChild(div);
        }
    }

    removePhoto(index) {
        if (this.capturedPhotos[index]) {
            this.capturedPhotos.splice(index, 1);
            this.updateShotSlots();
            this.renderCanvas();
        }
    }

    async downloadHighRes() {
        if (this.capturedPhotos.length === 0) {
            this.showToast('Belum ada foto yang diambil!', 'warning');
            return;
        }

        this.syncTextFromInputs();

        const highResCanvas = document.createElement('canvas');
        // If story-9-16 (base 540x960), scale=2 produces exact 1080x1920 px
        // For other strip layouts, scale=3 provides crisp 300 DPI print quality
        const exportScale = this.renderer.layout === 'story-9-16' ? 2 : 3;
        await this.renderer.render(highResCanvas, this.capturedPhotos, this.stickerManager, exportScale);

        const link = document.createElement('a');
        const layoutTag = this.renderer.layout === 'story-9-16' ? 'story-9-16-1080x1920' : this.renderer.layout;
        const filename = `photobooth-${layoutTag}-${this.renderer.titleText.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
        link.download = filename;
        link.href = highResCanvas.toDataURL('image/png', 1.0);
        link.click();

        this.showToast(`Foto berhasil diunduh (${highResCanvas.width}x${highResCanvas.height} px)! 🎉`, 'success');
    }

    async copyToClipboard() {
        if (this.capturedPhotos.length === 0) {
            this.showToast('Belum ada foto untuk disalin!', 'warning');
            return;
        }

        this.syncTextFromInputs();

        try {
            const highResCanvas = document.createElement('canvas');
            const copyScale = this.renderer.layout === 'story-9-16' ? 2 : 2;
            await this.renderer.render(highResCanvas, this.capturedPhotos, this.stickerManager, copyScale);
            highResCanvas.toBlob(async (blob) => {
                if (blob) {
                    await navigator.clipboard.write([
                        new ClipboardItem({ 'image/png': blob })
                    ]);
                    this.showToast(`Foto (${highResCanvas.width}x${highResCanvas.height} px) berhasil disalin ke clipboard! 📋`, 'success');
                }
            });
        } catch (e) {
            this.showToast('Gagal menyalin (perlu HTTPS atau browser terbaru)', 'error');
        }
    }

    saveToHistory() {
        const previewUrl = this.stripCanvas.toDataURL('image/jpeg', 0.8);
        const item = {
            id: Date.now(),
            date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            dataUrl: previewUrl
        };
        this.history.unshift(item);
        if (this.history.length > 8) this.history.pop();
        try {
            localStorage.setItem('photobooth_history', JSON.stringify(this.history));
        } catch (e) {}
        this.renderHistory();
    }

    loadHistory() {
        try {
            const saved = localStorage.getItem('photobooth_history');
            if (saved) {
                this.history = JSON.parse(saved);
                this.renderHistory();
            }
        } catch (e) {}
    }

    renderHistory() {
        const container = document.getElementById('historyContainer');
        if (!container) return;
        if (this.history.length === 0) {
            container.innerHTML = `<p class="text-xs text-slate-400 italic py-2">Belum ada riwayat foto.</p>`;
            return;
        }
        container.innerHTML = this.history.map(item => `
            <div class="relative group rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-white">
                <img src="${item.dataUrl}" class="w-full h-32 object-contain bg-slate-50 p-1">
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <a href="${item.dataUrl}" download="strip-${item.id}.jpg" class="p-1.5 bg-white text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-50 shadow">Unduh</a>
                </div>
            </div>
        `).join('');
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        const bgColors = {
            info: 'bg-slate-800 text-white',
            success: 'bg-emerald-600 text-white',
            warning: 'bg-amber-600 text-white',
            error: 'bg-rose-600 text-white'
        };
        toast.className = `${bgColors[type] || bgColors.info} px-4 py-2.5 rounded-2xl shadow-lg text-sm font-medium flex items-center gap-2 animate-bounce transition`;
        toast.innerText = message;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.app = new PhotoboothApp();
    window.app.init();
});

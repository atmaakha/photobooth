// WebRTC Camera Controller
class CameraController {
    constructor(videoElement) {
        this.video = videoElement;
        this.stream = null;
        this.isMirrored = true;
        this.selectedDeviceId = null;
    }

    async getDevices() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            return [];
        }
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            return devices.filter(d => d.kind === 'videoinput');
        } catch (e) {
            console.error('Error enumerating devices:', e);
            return [];
        }
    }

    async startCamera(deviceId = null) {
        if (this.stream) {
            this.stopCamera();
        }

        const constraints = {
            audio: false,
            video: {
                width: { ideal: 1920, min: 1280 },
                height: { ideal: 1080, min: 720 },
                frameRate: { ideal: 30 }
            }
        };

        if (deviceId) {
            constraints.video.deviceId = { exact: deviceId };
            this.selectedDeviceId = deviceId;
        } else {
            constraints.video.facingMode = 'user';
        }

        try {
            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.video.srcObject = this.stream;
            await this.video.play();
            this.updateMirror();
            return { success: true };
        } catch (error) {
            console.error('Failed to access camera:', error);
            return {
                success: false,
                error: error.name === 'NotAllowedError' 
                    ? 'Izin kamera ditolak. Harap izinkan akses kamera di browser Anda.' 
                    : 'Tidak dapat mengakses kamera: ' + error.message
            };
        }
    }

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
            if (this.video) {
                this.video.srcObject = null;
            }
        }
    }

    toggleMirror() {
        this.isMirrored = !this.isMirrored;
        this.updateMirror();
        return this.isMirrored;
    }

    updateMirror() {
        if (!this.video) return;
        this.video.style.transform = this.isMirrored ? 'scaleX(-1)' : 'scaleX(1)';
    }

    // Capture single snapshot frame from video feed (Preserves full horizontal width for group photos!)
    captureFrame(aspectRatio = null) {
        if (!this.video || !this.stream) return null;

        const videoW = this.video.videoWidth || 1280;
        const videoH = this.video.videoHeight || 720;

        let cropW = videoW;
        let cropH = videoH;

        if (aspectRatio) {
            cropH = videoW / aspectRatio;
            if (cropH > videoH) {
                cropH = videoH;
                cropW = videoH * aspectRatio;
            }
        }

        const startX = (videoW - cropW) / 2;
        const startY = (videoH - cropH) / 2;

        const targetW = 1280;
        const targetH = Math.round(targetW / (cropW / cropH));

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');

        // Draw video frame (with horizontal flip if mirrored)
        ctx.save();
        if (this.isMirrored) {
            ctx.translate(targetW, 0);
            ctx.scale(-1, 1);
        }

        // Apply CSS-like filter before drawing image onto canvas
        const currentFilterKey = window.filterManager ? window.filterManager.currentFilter : 'normal';
        const filterDef = FILTERS[currentFilterKey] || FILTERS['normal'];
        if (filterDef && filterDef.canvasFilter && filterDef.canvasFilter !== 'none') {
            ctx.filter = filterDef.canvasFilter;
        }

        ctx.drawImage(
            this.video,
            startX, startY, cropW, cropH,
            0, 0, targetW, targetH
        );

        ctx.filter = 'none';
        ctx.restore(); // Return to normal screen coordinate space

        // Apply extra soft color tone or grain
        if (window.filterManager) {
            window.filterManager.applyToCanvas(ctx, targetW, targetH, currentFilterKey);
        }

        // Apply AR Pink Love hearts filter to snapshot matching screen coordinates!
        if (window.faceTracker && window.faceTracker.enabled) {
            window.faceTracker.drawToCaptureCanvas(ctx, targetW, targetH, this.isMirrored);
        }

        return canvas.toDataURL('image/jpeg', 0.95);
    }
}

window.CameraController = CameraController;

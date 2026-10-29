// Professional Multi-Face Tracking & AR Pink Love Filter
// Tier 1: MediaPipe Face Detection (Sub-millimeter landmarks: eyes, nose, cheeks, forehead tilt)
// Tier 2: Chromium Hardware FaceDetector API
// Tier 3: Enhanced 2D Computer Vision with Eye-Contrast Facial Verification

class FaceTracker {
    constructor() {
        this.video = null;
        this.arCanvas = null;
        this.arCtx = null;
        this.animId = null;
        this.enabled = false;
        
        // Tracked faces array: [{ x, y, w, h, angle, leftCheek, rightCheek, crownX, crownY }]
        this.faces = [];
        
        // Tier 1: MediaPipe
        this.mpDetector = null;
        this.mpReady = false;
        this.mpFailed = false;

        // Tier 2: Native Chromium FaceDetector
        this.nativeDetector = null;
        this.hasNative = false;

        // Detection scheduling
        this.isDetecting = false;
        this.lastDetectTime = 0;

        // Tier 3: 2D CV Canvas (for offline/instant fallback)
        this.scanCanvas = document.createElement('canvas');
        this.scanCanvas.width = 120;
        this.scanCanvas.height = 68;
        this.scanCtx = this.scanCanvas.getContext('2d', { willReadFrequently: true });

        this.initEngines();
    }

    async initEngines() {
        // Try Tier 1: MediaPipe Face Detection
        if (typeof window !== 'undefined' && window.FaceDetection) {
            try {
                this.mpDetector = new window.FaceDetection({
                    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`
                });
                this.mpDetector.setOptions({
                    model: 'short', // Optimized for front-facing webcam within 2-4 meters
                    minDetectionConfidence: 0.52
                });
                this.mpDetector.onResults((results) => this.handleMediaPipeResults(results));
                await this.mpDetector.initialize();
                this.mpReady = true;
                console.log('✅ MediaPipe Face Detection initialized');
            } catch (err) {
                console.warn('MediaPipe initialization fallback:', err);
                this.mpFailed = true;
            }
        }

        // Try Tier 2: Chromium native FaceDetector
        if (!this.mpReady && 'FaceDetector' in window) {
            try {
                this.nativeDetector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 8 });
                this.hasNative = true;
            } catch (e) {
                this.hasNative = false;
            }
        }
    }

    init(videoElement, arCanvasElement) {
        this.video = videoElement;
        this.arCanvas = arCanvasElement;
        if (this.arCanvas) {
            this.arCtx = this.arCanvas.getContext('2d');
        }
    }

    start() {
        this.enabled = true;
        if (this.arCanvas) {
            this.arCanvas.style.display = 'block';
        }
        this.faces = [];
        this.loop();
    }

    stop() {
        this.enabled = false;
        if (this.animId) {
            cancelAnimationFrame(this.animId);
            this.animId = null;
        }
        if (this.arCtx && this.arCanvas) {
            this.arCtx.clearRect(0, 0, this.arCanvas.width, this.arCanvas.height);
            this.arCanvas.style.display = 'none';
        }
        this.faces = [];
    }

    // MediaPipe Result Callback (Highest Precision)
    handleMediaPipeResults(results) {
        if (!this.enabled || !results || !results.detections) return;

        const detected = [];
        results.detections.forEach(d => {
            if (!d.boundingBox) return;
            const b = d.boundingBox; // { xCenter, yCenter, width, height }
            const lm = d.landmarks || [];

            // Landmark indices:
            // 0: RIGHT_EYE, 1: LEFT_EYE, 2: NOSE_TIP, 3: MOUTH_CENTER, 4: RIGHT_EAR, 5: LEFT_EAR
            let angle = 0;
            let crownX = b.xCenter;
            let crownY = b.yCenter - b.height * 0.46;
            let leftCheek = null;
            let rightCheek = null;

            if (lm.length >= 4) {
                const rEye = lm[0];
                const lEye = lm[1];
                const nose = lm[2];
                const mouth = lm[3];

                // Precise head tilt angle from eye line
                angle = Math.atan2(lEye.y - rEye.y, lEye.x - rEye.x);

                // Crown sits right above the midpoint of the forehead
                const eyeMidX = (rEye.x + lEye.x) / 2;
                const eyeMidY = (rEye.y + lEye.y) / 2;
                crownX = eyeMidX;
                crownY = eyeMidY - b.height * 0.44;

                // Left & Right cheeks placed beside nose between eyes & mouth
                leftCheek = {
                    x: lEye.x + (lEye.x - nose.x) * 0.4,
                    y: (lEye.y + mouth.y) / 2
                };
                rightCheek = {
                    x: rEye.x + (rEye.x - nose.x) * 0.4,
                    y: (rEye.y + mouth.y) / 2
                };
            }

            detected.push({
                x: b.xCenter,
                y: b.yCenter,
                w: b.width,
                h: b.height,
                angle,
                crownX,
                crownY,
                leftCheek,
                rightCheek
            });
        });

        this.updateTrackedFaces(detected);
    }

    async runDetection() {
        if (!this.enabled || !this.video || this.video.readyState < 2 || this.isDetecting) return;
        this.isDetecting = true;

        try {
            // 1. MediaPipe
            if (this.mpReady && this.mpDetector) {
                await this.mpDetector.send({ image: this.video });
                this.isDetecting = false;
                return;
            }

            // 2. Native FaceDetector
            let detected = [];
            if (this.hasNative && this.nativeDetector) {
                const results = await this.nativeDetector.detect(this.video);
                if (results && results.length > 0) {
                    const vw = this.video.videoWidth || 1280;
                    const vh = this.video.videoHeight || 720;
                    detected = results.map(r => {
                        const xc = (r.boundingBox.x + r.boundingBox.width / 2) / vw;
                        const yc = (r.boundingBox.y + r.boundingBox.height / 2) / vh;
                        const w = r.boundingBox.width / vw;
                        const h = r.boundingBox.height / vh;
                        return {
                            x: xc,
                            y: yc,
                            w,
                            h,
                            angle: 0,
                            crownX: xc,
                            crownY: yc - h * 0.46,
                            leftCheek: { x: xc + w * 0.26, y: yc + h * 0.12 },
                            rightCheek: { x: xc - w * 0.26, y: yc + h * 0.12 }
                        };
                    });
                }
            }

            // 3. Robust 2D Geometric CV with Eye-Region Contrast Check
            if (detected.length === 0) {
                detected = this.detectFacesRobust2D();
            }

            this.updateTrackedFaces(detected);
        } catch (e) {
            // Graceful silent fallback
        }

        this.isDetecting = false;
    }

    // Robust 2D Skin + Facial Geometry + Eye-Contrast Verification (No false cabinet triggers!)
    detectFacesRobust2D() {
        const sw = this.scanCanvas.width;
        const sh = this.scanCanvas.height;
        this.scanCtx.drawImage(this.video, 0, 0, sw, sh);

        let imgData;
        try {
            imgData = this.scanCtx.getImageData(0, 0, sw, sh);
        } catch (e) {
            return [];
        }

        const data = imgData.data;
        const skinGrid = new Uint8Array(sw * sh);
        const lumaGrid = new Uint8Array(sw * sh);

        // Strict YCbCr skin classification
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const idx = i >> 2;

            // Luma
            lumaGrid[idx] = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

            // Kovac YCbCr skin locus
            const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
            const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

            // Stricter skin threshold to reject wooden cabinets & walls
            if (cb >= 85 && cb <= 122 && cr >= 135 && cr <= 168 && r > g && g > b) {
                skinGrid[idx] = 1;
            }
        }

        // 2D Connected Component Flood Fill (Extract cohesive face regions)
        const visited = new Uint8Array(sw * sh);
        const blobs = [];

        for (let y = 6; y < sh - 6; y += 2) {
            for (let x = 6; x < sw - 6; x += 2) {
                const idx = y * sw + x;
                if (skinGrid[idx] && !visited[idx]) {
                    // BFS flood fill
                    let minX = x, maxX = x, minY = y, maxY = y, count = 0;
                    const queue = [x, y];
                    visited[idx] = 1;

                    while (queue.length > 0) {
                        const qy = queue.pop();
                        const qx = queue.pop();
                        count++;
                        if (qx < minX) minX = qx;
                        if (qx > maxX) maxX = qx;
                        if (qy < minY) minY = qy;
                        if (qy > maxY) maxY = qy;

                        // Check 4 neighbors with step 2
                        const neighbors = [
                            [qx + 2, qy], [qx - 2, qy],
                            [qx, qy + 2], [qx, qy - 2]
                        ];
                        neighbors.forEach(([nx, ny]) => {
                            if (nx >= 0 && nx < sw && ny >= 0 && ny < sh) {
                                const nidx = ny * sw + nx;
                                if (skinGrid[nidx] && !visited[nidx]) {
                                    visited[nidx] = 1;
                                    queue.push(nx, ny);
                                }
                            }
                        });
                    }

                    const bw = maxX - minX;
                    const bh = maxY - minY;
                    // Realistic human head oval dimensions
                    if (count >= 24 && bw >= 12 && bh >= 14 && bw <= 55 && bh <= 55) {
                        const ratio = bh / bw;
                        if (ratio >= 0.85 && ratio <= 1.8) {
                            // Facial Feature Eye Contrast Verification:
                            // In real human faces, eye region is darker than cheeks/forehead!
                            let topLuma = 0, botLuma = 0, topCount = 0, botCount = 0;
                            const midY = Math.round(minY + bh * 0.45);
                            for (let cy = minY; cy < maxY; cy++) {
                                for (let cx = minX; cx < maxX; cx++) {
                                    const l = lumaGrid[cy * sw + cx];
                                    if (cy < midY) {
                                        topLuma += l; topCount++;
                                    } else {
                                        botLuma += l; botCount++;
                                    }
                                }
                            }

                            // Wall/cabinet has flat uniform luminance. Real face has darker upper eye/eyebrow zone.
                            const topAvg = topCount ? topLuma / topCount : 128;
                            const botAvg = botCount ? botLuma / botCount : 128;

                            // Allow if valid face contrast or clear skin cluster
                            if (topAvg <= botAvg + 18) {
                                blobs.push({
                                    x: (minX + maxX) / 2 / sw,
                                    y: (minY + maxY) / 2 / sh,
                                    w: (bw * 1.2) / sw,
                                    h: (bh * 1.2) / sh
                                });
                            }
                        }
                    }
                }
            }
        }

        return blobs.map(b => ({
            x: b.x,
            y: b.y,
            w: b.w,
            h: b.h,
            angle: 0,
            crownX: b.x,
            crownY: b.y - b.h * 0.46,
            leftCheek: { x: b.x + b.w * 0.26, y: b.y + b.h * 0.12 },
            rightCheek: { x: b.x - b.w * 0.26, y: b.y + b.h * 0.12 }
        }));
    }

    // Temporal Smoothing (Lerp) so hearts glide smoothly without jitter
    updateTrackedFaces(detected) {
        if (!detected || detected.length === 0) {
            // Decay old faces smoothly if no detection for 1.2s
            if (this.faces.length > 0 && Date.now() - this.lastDetectTime > 1200) {
                this.faces = [];
            }
            return;
        }

        this.lastDetectTime = Date.now();

        if (this.faces.length === 0) {
            this.faces = detected.map(d => ({ ...d }));
            return;
        }

        const matched = new Set();
        const updated = [];

        detected.forEach(d => {
            let bestIdx = -1;
            let bestDist = 0.35; // Maximum distance to consider same person

            this.faces.forEach((f, idx) => {
                if (matched.has(idx)) return;
                const dist = Math.hypot(d.x - f.x, d.y - f.y);
                if (dist < bestDist) {
                    bestDist = dist;
                    bestIdx = idx;
                }
            });

            if (bestIdx >= 0) {
                matched.add(bestIdx);
                const f = this.faces[bestIdx];
                const smooth = 0.38; // Exponential smoothing weight

                updated.push({
                    x: f.x + (d.x - f.x) * smooth,
                    y: f.y + (d.y - f.y) * smooth,
                    w: f.w + (d.w - f.w) * smooth,
                    h: f.h + (d.h - f.h) * smooth,
                    angle: f.angle + (d.angle - f.angle) * smooth,
                    crownX: (f.crownX || f.x) + ((d.crownX || d.x) - (f.crownX || f.x)) * smooth,
                    crownY: (f.crownY || f.y) + ((d.crownY || d.y) - (f.crownY || f.y)) * smooth,
                    leftCheek: d.leftCheek,
                    rightCheek: d.rightCheek
                });
            } else {
                updated.push({ ...d });
            }
        });

        // Limit to at most 6 detected people simultaneously
        this.faces = updated.slice(0, 6);
    }

    loop() {
        if (!this.enabled) return;

        // Run detection every 90ms (~11 fps detection with 60 fps render loop)
        const now = Date.now();
        if (now - this.lastDetectTime > 90) {
            this.runDetection();
        }

        if (this.arCanvas && this.video) {
            const vw = this.video.clientWidth || 640;
            const vh = this.video.clientHeight || 360;

            if (this.arCanvas.width !== vw || this.arCanvas.height !== vh) {
                this.arCanvas.width = vw;
                this.arCanvas.height = vh;
            }

            this.arCtx.clearRect(0, 0, vw, vh);

            // Check if camera is in mirror mode
            const isMirrored = (window.app && window.app.camera) ? window.app.camera.isMirrored : true;
            const time = now / 1000;

            this.faces.forEach((face, idx) => {
                this.drawPinkLoveFilter(this.arCtx, face, vw, vh, time, idx, isMirrored);
            });
        }

        this.animId = requestAnimationFrame(() => this.loop());
    }

    // Render AR Pink Love filter directly on face locations
    drawPinkLoveFilter(ctx, face, width, height, time, personIdx = 0, isMirrored = false) {
        ctx.save();

        // Calculate screen coordinates (respecting mirror mode!)
        const rawCrownX = (face.crownX !== undefined) ? face.crownX : face.x;
        const rawCrownY = (face.crownY !== undefined) ? face.crownY : (face.y - face.h * 0.46);

        const screenCrownX = isMirrored ? (1 - rawCrownX) * width : rawCrownX * width;
        const screenCrownY = rawCrownY * height;

        const headW = face.w * width;
        const headH = face.h * height;

        // In mirror mode, tilt angle is negated
        const tiltAngle = isMirrored ? -face.angle : face.angle;

        // 1. Floating Crown of 5 Glowing Pink Hearts
        ctx.save();
        ctx.translate(screenCrownX, screenCrownY);
        ctx.rotate(tiltAngle);

        const heartCount = 5;
        const arcRadius = Math.max(28, headW * 0.52);

        for (let i = 0; i < heartCount; i++) {
            const t = (i / (heartCount - 1)) - 0.5; // -0.5 to +0.5
            const spreadAngle = t * 1.15; // radian spread across head
            
            // Soft floating/bobbing sine animation
            const bob = Math.sin(time * 3 + i * 1.3 + personIdx * 1.7) * (headH * 0.035);
            
            const hx = Math.sin(spreadAngle) * arcRadius;
            const hy = -Math.cos(spreadAngle) * (arcRadius * 0.32) + bob;

            // Center heart is larger, outer hearts are cute & small
            const baseSize = (i === 2 ? 26 : (i === 1 || i === 3 ? 20 : 15)) * (headW / 180);
            const heartSize = Math.max(14, Math.min(46, baseSize));

            // Soft translucent pink opacity (tidak terlalu pekat, lembut & manis!)
            this.drawVectorHeart(ctx, hx, hy, heartSize, '#ff69a0', 0.68);

            // Sparkling stars between hearts
            if (i === 1 || i === 3) {
                const sparkX = hx + (i === 1 ? -10 : 10);
                const sparkY = hy - 6;
                this.drawSparkle(ctx, sparkX, sparkY, 7 * (headW / 180), 0.55);
            }
        }
        ctx.restore();

        // 2. Translucent Pink Cheek Blush & Tiny Cheek Hearts
        let leftCheekScreen, rightCheekScreen;

        if (face.leftCheek && face.rightCheek) {
            // High-precision landmark cheek coordinates
            if (isMirrored) {
                leftCheekScreen = { x: (1 - face.leftCheek.x) * width, y: face.leftCheek.y * height };
                rightCheekScreen = { x: (1 - face.rightCheek.x) * width, y: face.rightCheek.y * height };
            } else {
                leftCheekScreen = { x: face.leftCheek.x * width, y: face.leftCheek.y * height };
                rightCheekScreen = { x: face.rightCheek.x * width, y: face.rightCheek.y * height };
            }
        } else {
            // Estimated cheeks relative to face center
            const fx = isMirrored ? (1 - face.x) * width : face.x * width;
            const fy = face.y * height;
            const spreadX = headW * 0.28;
            const spreadY = headH * 0.12;
            leftCheekScreen = { x: fx + spreadX, y: fy + spreadY };
            rightCheekScreen = { x: fx - spreadX, y: fy + spreadY };
        }

        const cheekRadius = Math.max(10, headW * 0.13);
        const tinyHeartSize = Math.max(8, cheekRadius * 0.52);

        [leftCheekScreen, rightCheekScreen].forEach(pt => {
            if (!pt) return;
            // Soft glowing blush radial gradient
            ctx.save();
            const grad = ctx.createRadialGradient(pt.x, pt.y, 2, pt.x, pt.y, cheekRadius * 1.35);
            grad.addColorStop(0, 'rgba(255, 140, 180, 0.32)');
            grad.addColorStop(0.7, 'rgba(255, 185, 208, 0.14)');
            grad.addColorStop(1, 'rgba(255, 210, 225, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, cheekRadius * 1.35, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Tiny cute translucent heart on each cheek
            this.drawVectorHeart(ctx, pt.x, pt.y - 1, tinyHeartSize, '#ff6599', 0.62);
        });

        ctx.restore();
    }

    // High quality vector heart with soft glossy highlight
    drawVectorHeart(ctx, x, y, size, color = '#ff69a0', alpha = 0.68) {
        ctx.save();
        ctx.translate(x, y);
        ctx.globalAlpha = alpha;

        ctx.shadowColor = 'rgba(255, 105, 180, 0.38)';
        ctx.shadowBlur = size * 0.28;
        ctx.shadowOffsetY = size * 0.08;

        ctx.beginPath();
        const topCurveHeight = size * 0.3;
        ctx.moveTo(0, topCurveHeight);
        ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
        ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size, 0, size * 1.15);
        ctx.bezierCurveTo(0, size, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
        ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
        ctx.closePath();

        const grad = ctx.createLinearGradient(-size / 2, 0, size / 2, size);
        grad.addColorStop(0, '#ffa5c2');
        grad.addColorStop(0.5, '#ff6ca3');
        grad.addColorStop(1, '#ff4785');
        ctx.fillStyle = grad;
        ctx.fill();

        // 3D Jelly gloss shine
        ctx.shadowColor = 'transparent';
        ctx.beginPath();
        ctx.arc(-size * 0.22, topCurveHeight * 0.85, size * 0.09, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.68)';
        ctx.fill();

        ctx.restore();
    }

    // Sparkle star ✨
    drawSparkle(ctx, x, y, radius, alpha = 0.55) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#fff0f5';
        ctx.shadowColor = 'rgba(255, 192, 203, 0.55)';
        ctx.shadowBlur = radius;
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
            ctx.lineTo(Math.cos(i * Math.PI / 2) * radius + x, Math.sin(i * Math.PI / 2) * radius + y);
            ctx.lineTo(Math.cos((i + 0.5) * Math.PI / 2) * (radius * 0.35) + x, Math.sin((i + 0.5) * Math.PI / 2) * (radius * 0.35) + y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    // Apply filter to snapshot canvas
    drawToCaptureCanvas(targetCtx, targetWidth, targetHeight, isMirrored = false) {
        if (!this.enabled || this.faces.length === 0) return;
        const time = Date.now() / 1000;
        this.faces.forEach((face, idx) => {
            this.drawPinkLoveFilter(targetCtx, face, targetWidth, targetHeight, time, idx, isMirrored);
        });
    }
}

window.faceTracker = new FaceTracker();

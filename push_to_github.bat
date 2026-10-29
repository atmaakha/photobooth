@echo off
title Push to GitHub - Photobooth
cd /d "%~dp0"
echo ===================================================
echo Mengunggah proyek Photobooth ke GitHub atmaakha...
echo ===================================================
echo.
git push -u origin main
echo.
echo Selesai! Jika berhasil, proyek sudah ada di:
echo https://github.com/atmaakha/photobooth
echo ===================================================
pause

@echo off
title GitHub Repo Yukleme Sihirbazi
chcp 65001 > nul
echo ========================================================
echo   GANYAN PRO AI - GitHub Yukleme Araci
echo ========================================================
echo.
echo 1. github.com adresine gidin ve sag ustten "New repository" secin.
echo 2. Repository name kismina ornegin "at-yarisi-tahmin" yazin.
echo 3. "Create repository" butonuna basin (README veya .gitignore eklemeyin).
echo 4. Olusan deponun URL adresini kopyalayin (Orn: https://github.com/kullanici/at-yarisi-tahmin.git)
echo.
echo ========================================================
set /p REPO_URL="GitHub Repository URL'sini yapistirin ve Enter'a basin: "

if "%REPO_URL%"=="" (
    echo Hata: URL bos birakilamaz!
    pause
    exit /b
)

echo.
echo Git remote ayarlaniyor ve main dali push ediliyor...
cd /d "C:\Users\PC\Desktop\at-yarisi-tahmin"
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main
git push -u origin main

echo.
if %errorlevel% equ 0 (
    echo ========================================================
    echo   TEBRIKLER! Proje basariyla GitHub'a yuklendi!
    echo ========================================================
) else (
    echo.
    echo Bir hata olustu. Eger parola / token sorduysa, GitHub Personal Access Token (PAT) kullanmaniz gerekebilir.
)
echo.
pause

@echo off
set /p client_name=הכנס את שם הלקוח באנגלית (למשל sela):

REM יצירת תיקיית לקוח
mkdir "..\cards\%client_name%"

REM העתקת התבנית לתוך תיקיית הלקוח בשם index.html
copy "..\template\template.html" "..\cards\%client_name%\index.html"

echo כרטיס נוצר בהצלחה עבור %client_name%
pause

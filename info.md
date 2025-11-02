--remote-debugging-port=9222 --user-data-dir="C:\ChromeRemoteProfile"  
Это нужно, чтобы Chrome разрешил внешним программам читать список вкладок.
После запуска открой http://localhost:9222/json — там появится JSON со списком вкладок.


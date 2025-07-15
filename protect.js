// Chặn chuột phải
if (typeof document !== "undefined") {
    document.addEventListener("contextmenu", function (e) {
        e.preventDefault();
    });
    // Chặn F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S, Ctrl+Shift+C
    document.onkeydown = function (e) {
        if (
            e.keyCode == 123 || // F12
            (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 67)) || // Ctrl+Shift+I/C
            (e.ctrlKey && (e.keyCode == 85 || e.keyCode == 83)) // Ctrl+U/S
        ) {
            return false;
        }
    };
}

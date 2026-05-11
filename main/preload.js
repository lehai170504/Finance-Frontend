const { contextBridge, ipcRenderer } = require("electron");

// Bạn có thể thêm các API để giao tiếp giữa Web và App ở đây
contextBridge.exposeInMainWorld("electronAPI", {
  // Ví dụ: gửi tin nhắn xuống system
  // sendMessage: (message) => ipcRenderer.send('message', message),
});

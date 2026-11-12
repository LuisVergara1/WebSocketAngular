// SockJS expects the Node-style global alias in its browser crypto adapter.
Object.assign(globalThis, { global: globalThis });

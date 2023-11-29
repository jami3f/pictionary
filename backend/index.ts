const server = Bun.serve({
	fetch(req, server) {
		if (server.upgrade(req)) return;
		return new Response("Upgrade failed :(", { status: 500 });
	},
	websocket: {
		message(ws, message) {},
		open(ws) {
			ws.subscribe("images");
		},
		close(ws) {},
	},
});

const images: string[] = [];

setInterval(() => {
	images.push(`https://picsum.photos/1920/1080?t=${Date.now()}`);
	server.publish("images", images[-1]);
}, 7000);

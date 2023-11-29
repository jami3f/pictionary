import { useState, useEffect } from "react";
import useWebSocket, { SendMessage } from "react-use-websocket";

function SelectedImage(props: {
	image: string;
	setSelectedImage: (image: string | null) => void;
	sendMessage: SendMessage;
}) {
	const [hasLoaded, setHasLoaded] = useState(false);

	useEffect(() => {
		setHasLoaded(true);
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "auto";
		};
	}, []);
	return (
		<div
			className={`fixed left-0 md:left-1/4 top-0 w-screen md:w-1/2 h-outer-screen flex flex-col justify-center 
      gap-2 transition-opacity duration-500 ${hasLoaded ? "opacity-100" : "opacity-0"}`}
			// onAnimationEnd={() => !hasLoaded && setisHidden(true)}
			onTransitionEnd={() => !hasLoaded && props.setSelectedImage(null)}
		>
			<img
				src={props.image}
				alt="random"
			/>
			<div className="flex justify-around">
				<button
					className="bg-red-800 p-1 px-2 rounded text-slate-300 text-xl font-semibold"
					onClick={() => setHasLoaded(false)}
				>
					Cancel
				</button>
				<button
					className="bg-sky-800 p-1 px-2 rounded text-slate-300 text-xl font-semibold"
					onClick={() => props.sendMessage(`Voted for ${props.image}`)}
				>
					Vote
				</button>
			</div>
		</div>
	);
}

function App() {
	const [images, setImages] = useState<string[]>([]);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const { sendMessage, lastMessage } = useWebSocket("ws://localhost:3000");

	// const getImages = async () => {
	// 	const response = await fetch("/image");
	// 	const data = await response.json();
	// 	setImages(data.images);
	// };

	useEffect(() => {
		if (!lastMessage?.data) return;
		setImages(old => [...old, lastMessage.data]);
	}, [lastMessage]);

	return (
		<div
			id="container"
			className="w-full h-full flex flex-col justify-center items-center bg-slate-900"
		>
			<div
				id="grid-container"
				className={`grid grid-cols-2 gap-3 p-3 transition-all ${selectedImage ? "filter blur-sm opacity-80" : ""}`}
			>
				{images.map((image, index) => (
					<img
						key={index}
						src={image}
						alt="random"
						className="transition-opacity duration-500 opacity-0"
						onLoad={e => {
							e.currentTarget.className = "transition-opacity duration-500 opacity-100";
						}}
						onClick={() => {
							setSelectedImage(image);
						}}
					/>
				))}
			</div>
			{selectedImage && (
				<SelectedImage
					image={selectedImage}
					setSelectedImage={setSelectedImage}
					sendMessage={sendMessage}
				/>
			)}
		</div>
	);
}

export default App;

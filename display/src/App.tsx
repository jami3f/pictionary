import "./App.css";

import { useState, useEffect, useRef } from "react";

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

import useWebSocket from "react-use-websocket";

function App() {
	const [images, setImages] = useState<string[]>([]);
	const [shownImages, setShownImages] = useState<string[][]>([]);
	const carouselRef = useRef<Carousel>(null);
	const { lastMessage } = useWebSocket("ws://localhost:3000");

	useEffect(() => {
		document.addEventListener("contextmenu", e => e.preventDefault());
		setTimeout(() => carouselRef.current?.increment(0), 1000);
	}, []);

	useEffect(() => {
		console.log(images);
		setShownImages([]);
		for (let i = 0; i < images.length; i += 6) {
			const batch = images.slice(i, i + 6);
			console.log(batch);
			setShownImages(old => [...old, batch]);
		}
		if (images.length === 13) {
			carouselRef.current?.increment(2);
		}
	}, [images]);

	useEffect(() => {
		if (!lastMessage?.data) return;
		setImages(old => [...old, lastMessage.data]);
	}, [lastMessage]);

	return (
		<div className="h-screen flex items-center bg-black">
			<Carousel
				autoPlay
				infiniteLoop
				interval={8000}
				autoFocus
				centerMode
				centerSlidePercentage={95}
				showIndicators={false}
				showThumbs={false}
				showStatus={false}
				showArrows={false}
				stopOnHover={false}
				width={"100vw"}
				ref={carouselRef}
			>
				{shownImages.map((batch, batchIndex) => (
					<div
						id="container"
						className="grid grid-cols-3 grid-rows-2 gap-4 p-5 justify-center items-center"
						key={batchIndex}
					>
						{batch.map((image, index) => (
							<img
								key={index}
								src={image}
								alt="random"
								className="transition-opacity duration-500 opacity-0"
								onLoad={e => {
									e.currentTarget.className = "transition-opacity duration-500 opacity-100";
								}}
							/>
						))}
					</div>
				))}
			</Carousel>
		</div>
	);
}

export default App;

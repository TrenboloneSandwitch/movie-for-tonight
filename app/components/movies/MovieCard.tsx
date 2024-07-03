export const MovieCard = () => {
	return (
		<div className="flex flex-col bg-gray-100 py-6 sm:py-12">
			<div className="max-w-sm py-3 sm:mx-auto">
				<div className="flex max-h-56 justify-between space-x-5 border border-gray-100 bg-white p-6 shadow-lg sm:rounded-3xl">
					<div className="w-1/3 overflow-visible">
						<img
							className="rounded-3xl shadow-lg"
							src="https://www.themoviedb.org/t/p/w300_and_h450_bestv2/1LRLLWGvs5sZdTzuMqLEahb88Pc.jpg"
							alt=""
						/>
					</div>
					<div className="flex w-2/3 flex-col space-y-2">
						<div className="flex items-start justify-between">
							<h2 className="text-lg font-bold">Sweet Tooth: El niño ciervo</h2>
							<div className="rounded-xl bg-yellow-400 p-2 font-bold">7.2</div>
						</div>
						<div>
							<div className="text-sm text-gray-400">Genre: </div>
							<div className="text-lg text-gray-800">2019</div>
						</div>
						<p className="max-h-40 overflow-y-hidden text-gray-400">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
							eiusmod tempor incididunt ut labore et dolore magna aliqua.
						</p>
						<div className="text-a flex text-2xl font-bold">$83.90</div>
					</div>
				</div>
			</div>
		</div>
	);
};

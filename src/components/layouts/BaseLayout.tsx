const BaseLayout = () => {
	return (
		<div className="bg-gray-950 w-screen h-screen flex flex-col items-center justify-center gap-5 p-5">
			<div className="flex flex-col items-center gap-3">
				<h1 className="text-3xl text-slate-200">Hydrogen Simulator</h1>
				<span className="text-xl text-slate-300">
					Edit file src/app.tsx to start!
				</span>
			</div>
			{/*  <div className="flex flex-col items-center gap-3">
        <Routes>
          <Route path="/monitor" element={<Monitor />} />
        </Routes>
        <h1 className="text-3xl text-slate-200">{phrase}</h1>
        <span className="text-xl text-slate-300">
          Edit file src/app.tsx to start!
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-5 z-10">
        <img src={LOGO_SRC} width={50} height={50} alt="ElectronJS Logo" />
        <img src={ReactLogo} width={50} height={50} alt="ReactJS Logo" />
        <img
          src={TailwindCSSLogo}
          width={60}
          height={50}
          alt="TailwindCSS Logo"
        />
        <img
          src={ShadcnLogo}
          width={60}
          height={50}
          alt="TailwindCSS Logo"
          className="rounded-lg"
        />
        <img src={ViteLogo} width={50} height={50} alt="Vite Logo" />
        <img src={VitestLogo} width={60} height={50} alt="Vitest Logo" />
        <img
          src={ReactTestingLibraryLogo}
          width={60}
          height={50}
          alt="Vitest Logo"
        />
        <img src={BiomeLogo} width={160} height={50} alt="BiomeJS Logo" />
      </div>
      <Button
        onClick={changePhrase}
        className="z-10 bg-gray-900 text-slate-100"
        data-testid="random-button"
      >
        Click me!
      </Button> */}
			<div className="w-screen h-64 absolute top-[-200px] bg-blue-500/20 rounded-full blur-3xl z-0" />
		</div>
	);
};

export default BaseLayout;

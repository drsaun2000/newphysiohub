import LottiePlayer from "../animations/LottiePlayer";
import run from "../animations/data/Run.json";

export default function SignInBanner() {
    return (
      <div className="flex md:flex-row flex-col gap-2 items-center mb-5 md:p-4 p-3 bg-gradient-to-r from-purple-700 to-purple-500 rounded-lg shadow-md text-white">
        <LottiePlayer animationFile={run} width="50px" height="50px" />
        <div className="md:ml-4 ml-2 flex-1">
          <h2 className="font-semibold md:text-lg text-sm">Sign in and track your progress</h2>
          <p className="md:text-sm text-xs opacity-80">
            PhysioHub provides its members a dedicated dashboard to track their progress, 
            view their learning history and save articles for later.
          </p>
        </div>
        <button className="bg-white md:text-base text-xs text-purple-700 font-semibold px-4 md:py-2 py-1 rounded-full shadow-md">
          Sign in
        </button>
      </div>
    );
  }
  
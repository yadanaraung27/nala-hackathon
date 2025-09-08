import React from "react";
import frame1 from "./frame-1.svg";
import image2 from "./image-2.png";

export const LearningStyleSection = (): JSX.Element => {
  return (
    <section
      className="absolute w-[1097px] h-[291px] top-0 left-0"
      role="banner"
      aria-label="Learning Style Welcome Section"
    >
      <div className="relative w-[1099px] h-[291px]">
        <img
          className="absolute w-[1074px] h-[244px] top-[33px] left-[15px]"
          alt="Decorative frame background"
          src={frame1}
          role="presentation"
        />

        <div className="absolute w-[1099px] h-[291px] top-0 left-0">
          <div className="relative w-[1284px] h-[475px] -top-16 left-[-105px] bg-[url(/rectangle-2.svg)] bg-[100%_100%]">
            <img
              className="absolute w-[279px] h-[291px] top-16 left-[105px]"
              alt="Student working at desk illustration"
              src={image2}
            />

            <h1 className="absolute top-[166px] left-[430px] font-display-sm-medium font-[number:var(--display-sm-medium-font-weight)] text-white text-[length:var(--display-sm-medium-font-size)] tracking-[var(--display-sm-medium-letter-spacing)] leading-[var(--display-sm-medium-line-height)] whitespace-nowrap [font-style:var(--display-sm-medium-font-style)]">
              Welcome back, Student 👋
            </h1>

            <p className="w-[536px] top-[277px] left-[433px] text-xs absolute [font-family:'Inter-Regular',Helvetica] font-normal text-white tracking-[0] leading-[18px]">
              Your chatbot interactions and daily questions are personalised to
              match your learning style.
            </p>
          </div>
        </div>

        <p className="absolute w-[378px] top-[145px] left-[328px] [font-family:'DM_Sans-Bold',Helvetica] font-bold text-transparent text-[22px] tracking-[0] leading-[normal]">
          <span className="text-white">Your learning style: </span>
          <span className="text-[#5200f5]">The Interactor</span>
        </p>

        <div className="flex w-[135px] items-center justify-end gap-3 absolute top-[155px] left-[855px]">
          <button
            className="all-[unset] box-border inline-flex items-center justify-center gap-2 px-4 py-2.5 relative flex-[0_0_auto] bg-basewhite rounded-lg overflow-hidden border border-solid border-gray-300 shadow-shadow-xs hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            type="button"
            aria-label="Retake learning style quiz"
          >
            <span className="relative w-fit mt-[-1.00px] font-text-sm-medium font-[number:var(--text-sm-medium-font-weight)] text-gray-700 text-[length:var(--text-sm-medium-font-size)] tracking-[var(--text-sm-medium-letter-spacing)] leading-[var(--text-sm-medium-line-height)] whitespace-nowrap [font-style:var(--text-sm-medium-font-style)]">
              Retake Quiz
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

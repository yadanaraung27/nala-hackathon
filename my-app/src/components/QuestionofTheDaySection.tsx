import React, { useState } from "react";

export const QuestionOfTheDaySection = (): JSX.Element => {
  const [isHovered, setIsHovered] = useState(false);

  const questionData = {
    title: "Question of the Day",
    question:
      "Imagine you're explaining binary search trees to a study group. How would you describe the insertion process step-by-step, and what questions might your classmates ask that you should be prepared to answer?",
    buttonText: "Start Challenge",
  };

  const handleStartChallenge = () => {
    // Handle challenge start logic here
    console.log("Starting challenge...");
  };

  return (
    <section
      className="absolute w-[767px] h-[210px] top-[618px] left-[629px]"
      role="region"
      aria-labelledby="question-title"
    >
      <div className="h-[210px] rounded-[10px] overflow-hidden">
        <div className="relative w-[767px] h-[210px]">
          <div className="absolute w-[767px] h-[210px] top-0 left-0 shadow-[0px_4px_4px_#00000040]">
            <div className="relative w-[771px] h-[214px] -top-0.5 -left-0.5 bg-[#f1d99180] rounded-[10px] border-4 border-solid border-[#ff844c]">
              <blockquote className="absolute w-[705px] top-[72px] left-[35px] [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-sm tracking-[0.50px] leading-5">
                "{questionData.question}"
              </blockquote>
            </div>
          </div>

          <h2
            id="question-title"
            className="w-[356px] top-7 left-[37px] [font-family:'Poppins-Bold',Helvetica] text-[#bc2626] text-[22px] absolute font-bold tracking-[0] leading-[normal]"
          >
            {questionData.title}
          </h2>

          <button
            className="absolute w-[163px] h-[62px] top-[126px] left-[580px] bg-[#f36026] rounded-[10px] transition-all duration-200 hover:bg-[#e55520] focus:outline-none focus:ring-2 focus:ring-[#f36026] focus:ring-offset-2 active:transform active:scale-95"
            onClick={handleStartChallenge}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label="Start the daily coding challenge"
            type="button"
          >
            <span className="absolute w-[153px] top-[21px] left-1.5 [font-family:'Poppins-Regular',Helvetica] font-normal text-white text-sm text-center tracking-[0] leading-5">
              {questionData.buttonText}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

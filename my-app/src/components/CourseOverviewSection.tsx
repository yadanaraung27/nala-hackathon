import React from "react";
import icon5 from "./icon-5.svg";
import vector2 from "./vector-2.svg";
import vector from "./vector.svg";

export const CourseOverviewSection = (): JSX.Element => {
  const upcomingDeadlines = [
    {
      id: 1,
      title: "Topic 1 Quiz",
      time: "09:00AM",
      status: "Due Soon",
      icon: vector,
    },
    {
      id: 2,
      title: "Assignment",
      time: "11:00AM",
      status: "Due Soon",
      icon: vector2,
    },
  ];

  const topics = [
    {
      id: 1,
      title: "Elementary Number Theory",
      subtitle: "Topic 1",
      progress: 56,
    },
    {
      id: 2,
      title: "Propositional Logic",
      subtitle: "Topic 2",
      progress: 85,
    },
    {
      id: 3,
      title: "Predicate Logic",
      subtitle: "Topic 3",
      progress: 34,
    },
  ];

  return (
    <section
      className="absolute w-[1079px] h-[402px] top-0 left-0"
      role="main"
      aria-labelledby="course-overview-title"
    >
      <header>
        <h1
          id="course-overview-title"
          className="absolute top-0 left-0 font-m3-headline-medium-emphasized font-[number:var(--m3-headline-medium-emphasized-font-weight)] text-black text-[length:var(--m3-headline-medium-emphasized-font-size)] tracking-[var(--m3-headline-medium-emphasized-letter-spacing)] leading-[var(--m3-headline-medium-emphasized-line-height)] whitespace-nowrap [font-style:var(--m3-headline-medium-emphasized-font-style)]"
        >
          Course Overview
        </h1>
      </header>

      <div className="absolute w-[423px] h-[346px] top-14 left-0.5">
        <div className="relative h-[346px]">
          <div className="absolute w-[391px] h-[346px] top-0 left-0">
            <div className="relative h-[241px] bg-[#034eff99] rounded-[10px]">
              <div className="absolute w-12 h-[55px] top-[18px] left-[17px]">
                <img
                  className="absolute w-10 h-[50px] top-[3px] left-1"
                  alt="Calendar icon"
                  src={icon5}
                />
              </div>

              <div className="absolute w-[41px] top-[22px] left-[318px] font-display-sm-semibold font-[number:var(--display-sm-semibold-font-weight)] text-white text-[length:var(--display-sm-semibold-font-size)] tracking-[var(--display-sm-semibold-letter-spacing)] leading-[var(--display-sm-semibold-line-height)] whitespace-nowrap [font-style:var(--display-sm-semibold-font-style)]">
                5
              </div>

              <div className="absolute top-[38px] left-[79px] flex flex-col w-[344px] items-start gap-5">
                <div className="flex items-start gap-4 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="flex flex-col items-start justify-center gap-1 relative flex-1 self-stretch grow">
                    <h2 className="relative self-stretch mt-[-1.00px] font-text-lg-medium font-[number:var(--text-lg-medium-font-weight)] text-white text-[length:var(--text-lg-medium-font-size)] tracking-[var(--text-lg-medium-letter-spacing)] leading-[var(--text-lg-medium-line-height)] [font-style:var(--text-lg-medium-font-style)]">
                      Upcoming Deadlines
                    </h2>
                  </div>
                  <div className="relative w-5 h-5" />
                </div>
              </div>

              {upcomingDeadlines.map((deadline, index) => (
                <div
                  key={deadline.id}
                  className={`absolute w-[153px] h-[${index === 0 ? "37" : "42"}px] ${index === 0 ? "top-[93px]" : "top-40"} left-[71px]`}
                >
                  <div className="absolute w-9 h-9 top-0 left-0 bg-[#ffe3c2] rounded-lg">
                    <div
                      className={`relative w-5 h-${index === 0 ? "5" : "[21px]"} top-${index === 0 ? "2" : "[7px]"} left-2`}
                    >
                      <img
                        className={`absolute w-3.5 h-${index === 0 ? "4" : "[17px]"} top-0.5 left-[3px]`}
                        alt={`${deadline.title} icon`}
                        src={deadline.icon}
                      />
                    </div>
                  </div>

                  <div className="absolute top-0 left-12 [font-family:'Poppins-SemiBold',Helvetica] font-semibold text-white text-[10px] tracking-[0] leading-[normal]">
                    {deadline.title}
                  </div>

                  <div
                    className={`absolute top-[${index === 0 ? "22" : "25"}px] left-12 [font-family:'Poppins-Light',Helvetica] font-light text-white text-[10px] tracking-[0] leading-[normal]`}
                  >
                    {deadline.time}
                  </div>

                  <div
                    className={`absolute top-[${index === 0 ? "22" : "25"}px] left-[99px] [font-family:'Poppins-Light',Helvetica] font-light text-[#ffac47] text-[10px] tracking-[0] leading-[normal]`}
                  >
                    {deadline.status}
                  </div>
                </div>
              ))}

              <button
                className="absolute w-[89px] h-[33px] top-[174px] left-[283px] bg-white rounded-[20px] border border-solid border-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                aria-label="View all upcoming deadlines"
              >
                <span className="absolute w-[86px] top-[5px] left-5 [font-family:'Nunito_Sans-Bold',Helvetica] font-bold text-black text-xs tracking-[0] leading-[18px]">
                  View All
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute w-[606px] h-[245px] top-[55px] left-[471px] border border-solid border-black">
        <div className="absolute w-[582px] h-[31px] top-[23px] left-1 bg-colors-white-100 rounded-[10px]">
          <div className="h-[13px] relative left-12 flex flex-col w-[344px] items-start gap-5">
            <div className="flex items-start gap-4 relative self-stretch w-full flex-[0_0_auto] mb-[-14.60px]">
              <div className="flex flex-col items-start justify-center gap-1 relative flex-1 self-stretch grow">
                <h2 className="relative self-stretch mt-[-1.00px] font-text-lg-medium font-[number:var(--text-lg-medium-font-weight)] text-black text-[length:var(--text-lg-medium-font-size)] tracking-[var(--text-lg-medium-letter-spacing)] leading-[var(--text-lg-medium-line-height)] [font-style:var(--text-lg-medium-font-style)]">
                  Topics
                </h2>
              </div>
              <div className="relative w-5 h-5" />
            </div>
          </div>
        </div>

        {topics.map((topic, index) => (
          <div
            key={topic.id}
            className={`w-[${index === 2 ? "494" : "496"}px] ${
              index === 0
                ? "top-[82px]"
                : index === 1
                  ? "top-[129px]"
                  : "top-44"
            } left-[${index === 2 ? "53" : "54"}px] absolute h-8`}
          >
            <div className="relative h-8">
              <div className="absolute w-[390px] h-8 top-0 left-0">
                <h3 className="absolute w-[257px] top-px left-[130px] [font-family:'Poppins-Medium',Helvetica] font-medium text-black text-[10px] tracking-[0] leading-[normal]">
                  {topic.title}
                </h3>

                <p className="absolute w-[198px] top-[18px] left-[130px] [font-family:'Poppins-Regular',Helvetica] font-normal text-[#49494e] text-[8px] tracking-[0] leading-[normal]">
                  {topic.subtitle}
                </p>

                <button
                  className="absolute w-[97px] h-8 top-0 left-0 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-opacity"
                  aria-label={`Start chat for ${topic.title}`}
                >
                  <div className="relative w-[95px] h-8 rounded-lg">
                    <div className="w-[95px] h-8 left-0 bg-[#e9eefc] rounded-lg rotate-180 absolute top-0" />
                    <span
                      className={`absolute w-[74px] top-1 ${index === 2 ? "left-3" : "left-[11px]"} [font-family:'Poppins-Medium',Helvetica] font-medium text-[#272835] text-sm tracking-[0] leading-[normal]`}
                    >
                      Start Chat
                    </span>
                  </div>
                </button>
              </div>

              <div
                className={`absolute w-[${index === 2 ? "136" : "138"}px] h-[7px] top-[21px] left-[${index === 2 ? "358" : "357"}px]`}
                role="progressbar"
                aria-valuenow={topic.progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${topic.title} progress: ${topic.progress}%`}
              >
                <div
                  className={`w-full h-[7px] ${
                    index === 0
                      ? "bg-[url(/color.svg)]"
                      : index === 1
                        ? "bg-[url(/color-2.svg)]"
                        : "bg-[url(/color-4.svg)]"
                  } bg-[100%_100%]`}
                >
                  <div
                    className={`${
                      index === 0
                        ? "w-[77px]"
                        : index === 1
                          ? "w-[118px]"
                          : "w-[47px]"
                    } h-[7px] ${
                      index === 0
                        ? "bg-[url(/image.svg)]"
                        : index === 1
                          ? "bg-[url(/color-3.svg)]"
                          : "bg-[url(/color-5.svg)]"
                    } bg-[100%_100%]`}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

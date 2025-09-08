import React from "react";
import { CourseOverviewSection } from "./CourseOverviewSection";
import { LearningAnalyticsSection } from "./LearningAnalyticsSection";
import { LearningStyleSection } from "./LearningStyleSection";
import { QuestionOfTheDaySection } from "./QuestionOfTheDaySection";
import { SidebarNavigationSection } from "./SidebarNavigationSection";
import icon2 from "./icon-2.svg";
import icon3 from "./icon-3.svg";
import icon4 from "./icon-4.svg";
import icon from "./icon.svg";
import image11 from "./image-11.png";

const navigationItems = [
  {
    id: "profile",
    label: "Profile",
    icon: "/user-01.svg",
    active: false,
  },
  {
    id: "activity",
    label: "Activity",
    icon: "/activity.svg",
    active: false,
  },
  {
    id: "toggle-features",
    label: "Toggle Features",
    icon: null,
    active: false,
  },
];

const bottomActions = [
  {
    id: "chatbot",
    label: "Go to Chatbot",
    icon: icon,
  },
  {
    id: "logout",
    label: "Log out",
    icon: icon3,
  },
];

export const ImprovedNala = (): JSX.Element => {
  return (
    <main className="bg-white grid justify-items-center [align-items:start] w-screen">
      <div className="bg-white w-[1483px] h-[1900px] relative">
        <aside
          className="absolute w-[241px] h-[1701px] top-[153px] left-8"
          role="navigation"
          aria-label="Main navigation"
        >
          <SidebarNavigationSection />

          <section className="top-[310px] absolute w-[204px] h-[22px] left-4">
            <h2 className="absolute w-[202px] top-0 left-0 [font-family:'Poppins-SemiBold',Helvetica] font-semibold text-white text-xs tracking-[1.00px] leading-5 whitespace-nowrap">
              CUSTOMIZATION
            </h2>
          </section>

          <section className="top-[75px] absolute w-[204px] h-[22px] left-4">
            <h2 className="absolute w-[202px] top-0 left-0 [font-family:'Poppins-SemiBold',Helvetica] font-semibold text-white text-xs tracking-[1.00px] leading-5 whitespace-nowrap">
              DASHBOARD
            </h2>
          </section>

          <nav
            className="absolute top-[431px] left-[15px]"
            aria-label="User navigation"
          >
            {navigationItems.map((item, index) => (
              <div
                key={item.id}
                className={`w-[${index === 0 ? "182" : "183"}px] ${index === 0 ? "top-0" : `top-[${55 * index}px]`} ${index === 0 ? "left-0" : "left-[-1px]"} flex items-start absolute`}
              >
                <button className="flex items-center gap-2 px-3 py-2 relative flex-1 self-stretch grow bg-basewhite rounded-md overflow-hidden hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <div className="flex items-center gap-3 relative flex-1 grow">
                    {item.icon && (
                      <div
                        className={`relative w-6 h-6 bg-[url(${item.icon})] bg-[100%_100%]`}
                      />
                    )}
                    {!item.icon && <div className="relative w-6 h-6" />}

                    <span className="relative w-fit mt-[-1.00px] font-text-md-medium font-[number:var(--text-md-medium-font-weight)] text-gray-700 text-[length:var(--text-md-medium-font-size)] tracking-[var(--text-md-medium-letter-spacing)] leading-[var(--text-md-medium-line-height)] whitespace-nowrap [font-style:var(--text-md-medium-font-style)]">
                      {item.label}
                    </span>
                  </div>

                  <div className="relative w-5 h-5" />
                </button>
              </div>
            ))}
          </nav>

          <div className="absolute w-[49px] h-[46px] top-[351px] left-[23px]">
            <div className="h-[46px]">
              <div className="w-[49px] h-[46px]">
                <div className="relative h-[46px] bg-[#96becf] rounded-[100px] overflow-hidden">
                  <img
                    className="absolute w-[45px] h-[42px] top-0.5 left-0.5"
                    alt="The Interactor learning style icon"
                    src={icon4}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="absolute w-[151px] h-[18px] top-[354px] left-[86px] [font-family:'Inter-Bold',Helvetica] font-bold text-white text-sm tracking-[0] leading-[18px]">
            The Interactor
          </div>

          <div className="w-[151px] h-[18px] top-[374px] left-[86px] text-[9px] absolute [font-family:'Inter-Regular',Helvetica] font-normal text-white tracking-[0] leading-[18px]">
            Social and communicative
          </div>

          <div className="absolute w-[139px] h-[22px] top-[34px] left-[63px]">
            <div className="relative w-[137px] h-[22px]">
              <div className="w-16 h-[22px] left-[73px] bg-[#1c4185] absolute top-0" />

              <h1 className="absolute w-[133px] h-5 top-px left-0 [font-family:'Poppins-Bold',Helvetica] font-bold text-neutral-white text-lg text-center tracking-[-1.40px] leading-[22px] whitespace-nowrap">
                Discrete Math
              </h1>
            </div>
          </div>

          <div className="absolute w-[116px] h-[75px] top-[1561px] left-[46px]">
            {bottomActions.map((action, index) => (
              <div
                key={action.id}
                className={`absolute ${index === 0 ? "w-[29px] h-[26px] top-[49px] left-0" : "w-[26px] h-6 top-[1573px] left-[46px]"}`}
              >
                {index === 0 && (
                  <>
                    <div className="absolute w-[29px] h-[26px] top-0 left-0">
                      <img
                        className="absolute w-[26px] h-6 top-px left-0.5"
                        alt="Go to Chatbot"
                        src={action.icon}
                      />
                    </div>

                    <div className="absolute w-[29px] h-[26px] top-0 left-0">
                      <img
                        className="absolute w-[26px] h-6 top-px left-0.5"
                        alt="Go to Chatbot"
                        src={icon2}
                      />
                    </div>
                  </>
                )}
              </div>
            ))}

            <div className="absolute w-[52px] h-[30px] top-2 left-[60px]">
              <button className="flex max-w-[52px] w-[52px] min-h-[30px] items-center justify-end gap-2 absolute top-0 left-0 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <span className="relative w-fit ml-[-23.00px] font-charts-group font-[number:var(--charts-group-font-weight)] text-[#ffffffde] text-[length:var(--charts-group-font-size)] text-right tracking-[var(--charts-group-letter-spacing)] leading-[var(--charts-group-line-height)] whitespace-nowrap [font-style:var(--charts-group-font-style)]">
                  Go to Chatbot
                </span>
              </button>

              <button className="flex max-w-[52px] w-[52px] min-h-[30px] items-center justify-end gap-2 absolute top-0 left-0 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <span className="relative w-fit ml-[-23.00px] font-charts-group font-[number:var(--charts-group-font-weight)] text-[#ffffffde] text-[length:var(--charts-group-font-size)] text-right tracking-[var(--charts-group-letter-spacing)] leading-[var(--charts-group-line-height)] whitespace-nowrap [font-style:var(--charts-group-font-style)]">
                  Go to Chatbot
                </span>
              </button>
            </div>

            <div className="absolute w-[41px] h-5 top-[51px] left-[39px]">
              <button className="absolute h-5 top-0 left-0 font-charts-group font-[number:var(--charts-group-font-weight)] text-[#ffffffde] text-[length:var(--charts-group-font-size)] text-right tracking-[var(--charts-group-letter-spacing)] leading-[var(--charts-group-line-height)] whitespace-nowrap [font-style:var(--charts-group-font-style)] hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Log out
              </button>

              <button className="absolute h-5 top-0 left-0 font-charts-group font-[number:var(--charts-group-font-weight)] text-[#ffffffde] text-[length:var(--charts-group-font-size)] text-right tracking-[var(--charts-group-letter-spacing)] leading-[var(--charts-group-line-height)] whitespace-nowrap [font-style:var(--charts-group-font-style)] hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Log out
              </button>
            </div>
          </div>

          <div className="absolute w-[26px] h-6 top-[1573px] left-[46px]">
            <div className="relative h-6">
              <img
                className="absolute w-6 h-[22px] top-px left-px"
                alt="Log out"
                src={icon3}
              />
            </div>
          </div>
        </aside>

        <header className="absolute w-[678px] top-[193px] left-[319px]">
          <h1 className="font-display-sm-medium font-[number:var(--display-sm-medium-font-weight)] text-gray-900 text-[length:var(--display-sm-medium-font-size)] tracking-[var(--display-sm-medium-letter-spacing)] leading-[var(--display-sm-medium-line-height)] [font-style:var(--display-sm-medium-font-style)]">
            Learning Analytics Dashboard
          </h1>
        </header>

        <div className="absolute w-[678px] top-[235px] left-[319px] font-text-md-normal font-[number:var(--text-md-normal-font-weight)] text-gray-500 text-[length:var(--text-md-normal-font-size)] tracking-[var(--text-md-normal-letter-spacing)] leading-[var(--text-md-normal-line-height)] [font-style:var(--text-md-normal-font-style)]">
          <time dateTime="2025-08-15">Friday, 15 August 2025</time>
        </div>

        <section
          className="absolute w-[1129px] h-[982px] top-[872px] left-[302px]"
          aria-label="Analytics and course overview"
        >
          <LearningAnalyticsSection />
          <CourseOverviewSection />
        </section>

        <section
          className="absolute w-[1097px] h-[291px] top-[296px] left-[304px]"
          aria-label="Learning style information"
        >
          <LearningStyleSection />
          <p className="w-[378px] top-[180px] left-[366px] [font-family:'DM_Sans-Bold',Helvetica] text-[#5200f5] text-[15px] absolute font-bold tracking-[0] leading-[normal]">
            Learn more about your style
          </p>
        </section>

        <section aria-label="Question of the day">
          <QuestionOfTheDaySection />
        </section>

        <article
          className="absolute w-[281px] h-[149px] top-[660px] left-[319px]"
          aria-label="Current streak information"
        >
          <div className="relative w-[283px] h-[149px]">
            <div className="absolute w-[283px] h-[149px] top-0 left-0">
              <div className="relative w-[279px] h-[149px] rounded-lg">
                <div className="top-[38px] left-[25px] font-text-sm-medium font-[number:var(--text-sm-medium-font-weight)] absolute w-[186px] text-gray-500 text-[length:var(--text-sm-medium-font-size)] tracking-[var(--text-sm-medium-letter-spacing)] leading-[var(--text-sm-medium-line-height)] [font-style:var(--text-sm-medium-font-style)]">
                  Complate Course
                </div>

                <div className="absolute w-[279px] h-[149px] top-0 left-0 bg-basewhite rounded-lg border border-solid border-gray-200 shadow-shadow-sm" />

                <div className="top-[23px] left-6 font-text-sm-medium font-[number:var(--text-sm-medium-font-weight)] absolute w-[186px] text-gray-500 text-[length:var(--text-sm-medium-font-size)] tracking-[var(--text-sm-medium-letter-spacing)] leading-[var(--text-sm-medium-line-height)] [font-style:var(--text-sm-medium-font-style)]">
                  Current Streak
                </div>

                <div className="flex w-[186.33px] h-[49px] items-end gap-4 absolute top-[38px] left-[25px]">
                  <div className="relative flex-1 font-display-sm-semibold font-[number:var(--display-sm-semibold-font-weight)] text-gray-900 text-[length:var(--display-sm-semibold-font-size)] tracking-[var(--display-sm-semibold-letter-spacing)] leading-[var(--display-sm-semibold-line-height)] [font-style:var(--display-sm-semibold-font-style)]">
                    7 days
                  </div>
                </div>
              </div>
            </div>

            <img
              className="absolute w-[69px] h-[69px] top-[15px] left-44 aspect-[1] object-cover"
              alt="Streak achievement illustration"
              src={image11}
            />

            <p className="absolute w-[257px] top-[91px] left-[17px] [font-family:'Poppins-Regular',Helvetica] font-normal text-transparent text-sm tracking-[0.50px] leading-5">
              <span className="text-[#bc2626] tracking-[0.07px]">
                Your daily question is ready!
                <br />
              </span>

              <span className="text-[#f24343] tracking-[0.07px]">
                Keep your 7-day streak going
              </span>
            </p>
          </div>
        </article>
      </div>
    </main>
  );
};

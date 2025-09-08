import React from "react";
import { DotsVertical } from "./DotsVertical";
import divider from "./divider.svg";
import line2 from "./line-2.svg";
import line3 from "./line-3.svg";
import line4 from "./line-4.svg";
import line5 from "./line-5.svg";
import line from "./line.svg";
import rays from "./rays.svg";
import series1Fill from "./series-1-fill.svg";
import series1Line from "./series-1-line.svg";
import series2Line from "./series-2-line.svg";
import series3Line from "./series-3-line.svg";

export const LearningAnalyticsSection = (): JSX.Element => {
  const statsData = [
    { label: "Conversation Sessions", value: "100" },
    { label: "Topics Discussed", value: "6" },
    { label: "Upcoming", value: "91" },
  ];

  const masteryLevels = [
    { value: "100", top: 0, left: 156 },
    { value: "80", top: 25, left: 158 },
    { value: "60", top: 51, left: 158 },
    { value: "40", top: 76, left: 158 },
    { value: "20", top: 102, left: 159 },
  ];

  const masteryLabels = [
    { text: "Tier 2", top: 34, left: 271 },
    { text: "Evaluation", top: 163, left: 283 },
    { text: "Innovation", top: 163, left: 1 },
    { text: "Basic Understanding", top: 34, left: 0 },
    { text: "Comprehension", top: -2, left: 113 },
    { text: "Analysis", top: 278, left: 201 },
    { text: "Application", top: 278, left: 59 },
  ];

  const chartYAxisLabels = [
    { value: "100", height: "22px" },
    { value: "80", height: "17px" },
    { value: "60", height: "17px" },
    { value: "40", height: "17px" },
    { value: "20", height: "17px" },
    { value: "0", height: "17px" },
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

  const legendItems = [
    { color: "bg-w-500", label: "Calculus" },
    { color: "bg-w-300", label: "Programming" },
  ];

  return (
    <section
      className="absolute w-[1127px] h-[632px] top-[350px] left-0.5"
      role="main"
      aria-labelledby="analytics-heading"
    >
      <header>
        <h1
          id="analytics-heading"
          className="absolute w-[297px] top-0 left-0 font-m3-headline-medium-emphasized font-[number:var(--m3-headline-medium-emphasized-font-weight)] text-black text-[length:var(--m3-headline-medium-emphasized-font-size)] tracking-[var(--m3-headline-medium-emphasized-letter-spacing)] leading-[var(--m3-headline-medium-emphasized-line-height)] whitespace-nowrap [font-style:var(--m3-headline-medium-emphasized-font-style)]"
        >
          Your Learning Analytics
        </h1>
      </header>

      <div
        className="flex w-[751px] items-center gap-6 absolute top-[52px] left-0"
        role="region"
        aria-label="Statistics overview"
      >
        {statsData.map((stat, index) => (
          <article
            key={index}
            className="flex flex-col items-start gap-2 p-6 relative flex-1 grow bg-basewhite rounded-lg border border-solid border-gray-200 shadow-shadow-sm"
          >
            <h2 className="relative self-stretch mt-[-1.00px] font-text-sm-medium font-[number:var(--text-sm-medium-font-weight)] text-gray-500 text-[length:var(--text-sm-medium-font-size)] tracking-[var(--text-sm-medium-letter-spacing)] leading-[var(--text-sm-medium-line-height)] [font-style:var(--text-sm-medium-font-style)]">
              {stat.label}
            </h2>
            <div className="flex items-end gap-4 relative self-stretch w-full flex-[0_0_auto]">
              <div className="relative flex-1 mt-[-1.00px] font-display-sm-semibold font-[number:var(--display-sm-semibold-font-weight)] text-gray-900 text-[length:var(--display-sm-semibold-font-size)] tracking-[var(--display-sm-semibold-letter-spacing)] leading-[var(--display-sm-semibold-line-height)] [font-style:var(--display-sm-semibold-font-style)]">
                {stat.value}
              </div>
            </div>
          </article>
        ))}
      </div>

      <aside
        className="flex flex-col w-[343px] items-start gap-5 absolute top-[184px] left-[782px]"
        role="complementary"
        aria-labelledby="mastery-heading"
      >
        <article className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] bg-basewhite rounded-lg overflow-hidden border border-solid border-gray-200 shadow-shadow-sm">
          <div className="flex flex-col items-start gap-6 px-4 py-5 relative self-stretch w-full flex-[0_0_auto]">
            <div className="items-start gap-5 flex flex-col relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex flex-col items-start gap-4 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex flex-col items-start gap-1 relative self-stretch w-full flex-[0_0_auto]">
                  <h2
                    id="mastery-heading"
                    className="relative self-stretch mt-[-1.00px] font-text-md-medium font-[number:var(--text-md-medium-font-weight)] text-gray-900 text-[length:var(--text-md-medium-font-size)] tracking-[var(--text-md-medium-letter-spacing)] leading-[var(--text-md-medium-line-height)] [font-style:var(--text-md-medium-font-style)]"
                  >
                    Mastery Level
                  </h2>
                </div>
              </div>
            </div>

            <div className="inline-flex items-start gap-[12.69px] relative flex-[0_0_auto]">
              <div className="relative w-[311px] h-[295.13px]">
                <div className="relative h-[295px]">
                  <div className="absolute w-[311px] h-[295px] top-0 left-0">
                    <div className="absolute w-[339px] h-[248px] top-[25px] -left-4">
                      <img
                        className="absolute w-[50px] h-12 top-[109px] left-[146px] object-cover"
                        alt=""
                        src={line}
                      />

                      <img
                        className="w-[99px] h-[97px] top-[83px] left-[122px] absolute object-cover"
                        alt=""
                        src={line2}
                      />

                      <img
                        className="w-[149px] h-[145px] top-[58px] left-[97px] absolute object-cover"
                        alt=""
                        src={line3}
                      />

                      <img
                        className="w-[198px] h-[193px] top-[33px] left-[72px] absolute object-cover"
                        alt=""
                        src={line4}
                      />

                      <img
                        className="w-[248px] h-[241px] top-[7px] left-[47px] absolute object-cover"
                        alt=""
                        src={line5}
                      />

                      <img
                        className="absolute w-[248px] h-[241px] top-[7px] left-[47px]"
                        alt=""
                        src={rays}
                      />

                      {masteryLevels.map((level, index) => (
                        <div
                          key={index}
                          className={`inline-flex items-start absolute top-[${level.top}px] left-[${level.left}px] mix-blend-multiply`}
                        >
                          <div className="inline-flex items-center justify-center px-[6.35px] py-[1.59px] relative flex-[0_0_auto] bg-gray-100 rounded-[12.69px]">
                            <div className="relative w-fit mt-[-0.79px] font-text-xs-medium font-[number:var(--text-xs-medium-font-weight)] text-gray-700 text-[length:var(--text-xs-medium-font-size)] text-center tracking-[var(--text-xs-medium-letter-spacing)] leading-[var(--text-xs-medium-line-height)] whitespace-nowrap [font-style:var(--text-xs-medium-font-style)]">
                              {level.value}
                            </div>
                          </div>
                        </div>
                      ))}

                      {masteryLabels.map((label, index) => (
                        <div
                          key={index}
                          className={`absolute h-4 top-[${label.top}px] left-[${label.left}px] font-text-sm-medium font-[number:var(--text-sm-medium-font-weight)] text-gray-500 text-[length:var(--text-sm-medium-font-size)] text-center tracking-[var(--text-sm-medium-letter-spacing)] leading-[var(--text-sm-medium-line-height)] whitespace-nowrap [font-style:var(--text-sm-medium-font-style)]`}
                        >
                          {label.text}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="absolute w-[158px] h-[165px] top-[85px] left-[76px] bg-[url(/series-3-fill.svg)] bg-[100%_100%]">
                    <img
                      className="absolute w-40 h-[167px] -top-px -left-px"
                      alt="Series 3 data visualization"
                      src={series3Line}
                    />
                  </div>

                  <div className="absolute w-[198px] h-[147px] top-[81px] left-14 bg-[url(/series-2-fill.svg)] bg-[100%_100%]">
                    <img
                      className="absolute w-[200px] h-[148px] -top-px -left-px"
                      alt="Series 2 data visualization"
                      src={series2Line}
                    />
                  </div>

                  <div className="absolute w-[122px] h-[145px] top-[60px] left-[107px]">
                    <div className="relative w-[198px] h-[146px] -top-px left-[-75px]">
                      <img
                        className="absolute w-[196px] h-[145px] top-px left-px"
                        alt="Series 1 data fill"
                        src={series1Fill}
                      />

                      <img
                        className="absolute w-[198px] h-[146px] top-0 left-0"
                        alt="Series 1 data visualization"
                        src={series1Line}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer className="items-center gap-3 pt-0 pb-3 px-0 flex flex-col relative self-stretch w-full flex-[0_0_auto]">
            <img
              className="relative self-stretch w-full h-px"
              alt=""
              src={divider}
            />

            <div className="flex items-center justify-end gap-4 px-4 py-0 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex items-center justify-end gap-3 relative flex-1 grow">
                <button
                  className="all-[unset] box-border inline-flex items-center justify-center gap-2 px-4 py-2.5 relative flex-[0_0_auto] bg-basewhite rounded-lg overflow-hidden border border-solid border-gray-300 shadow-shadow-xs"
                  type="button"
                  aria-label="View detailed mastery level report"
                >
                  <span className="relative w-fit mt-[-1.00px] font-text-sm-medium font-[number:var(--text-sm-medium-font-weight)] text-gray-700 text-[length:var(--text-sm-medium-font-size)] tracking-[var(--text-sm-medium-letter-spacing)] leading-[var(--text-sm-medium-line-height)] whitespace-nowrap [font-style:var(--text-sm-medium-font-style)]">
                    View full report
                  </span>
                </button>
              </div>
            </div>
          </footer>
        </article>
      </aside>

      <main
        className="flex flex-col w-[752px] h-[448px] items-start absolute top-[184px] left-px bg-basewhite rounded-lg overflow-hidden border border-solid border-gray-200 shadow-shadow-sm"
        role="main"
        aria-labelledby="activity-heading"
      >
        <div className="flex flex-col items-start gap-6 p-6 relative flex-1 self-stretch w-full grow">
          <div className="items-start gap-5 flex flex-col relative self-stretch w-full flex-[0_0_auto]">
            <header className="flex items-start gap-4 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex flex-col items-start justify-center gap-1 relative flex-1 self-stretch grow">
                <h2
                  id="activity-heading"
                  className="relative self-stretch mt-[-1.00px] font-text-md-medium font-[number:var(--text-md-medium-font-weight)] text-gray-900 text-[length:var(--text-md-medium-font-size)] tracking-[var(--text-md-medium-letter-spacing)] leading-[var(--text-md-medium-line-height)] [font-style:var(--text-md-medium-font-style)]"
                >
                  Learning Activity
                </h2>

                <p className="relative self-stretch font-text-sm-normal font-[number:var(--text-sm-normal-font-weight)] text-gray-500 text-[length:var(--text-sm-normal-font-size)] tracking-[var(--text-sm-normal-letter-spacing)] leading-[var(--text-sm-normal-line-height)] [font-style:var(--text-sm-normal-font-style)]">
                  Track how your rating compares to your industry average.
                </p>
              </div>

              <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                <DotsVertical className="!relative !w-5 !h-5" />
              </div>
            </header>
          </div>

          <div className="relative flex-1 self-stretch w-full grow">
            <div className="relative w-[704px] h-[328px]">
              <div className="flex w-[704px] h-[328px] items-start gap-1 absolute top-0 left-0">
                <div className="inline-flex flex-col items-start justify-center pt-0 pb-6 px-0 flex-[0_0_auto] relative self-stretch">
                  <div className="relative w-fit ml-[-33.50px] mr-[-33.50px] rotate-[-90.00deg] font-text-xs-medium font-[number:var(--text-xs-medium-font-weight)] text-gray-500 text-[length:var(--text-xs-medium-font-size)] text-center tracking-[var(--text-xs-medium-letter-spacing)] leading-[var(--text-xs-medium-line-height)] whitespace-nowrap [font-style:var(--text-xs-medium-font-style)]">
                    Security rating
                  </div>
                </div>

                <div className="flex flex-col items-end relative flex-1 self-stretch grow">
                  <div
                    className="inline-flex items-start gap-[13px] relative flex-[0_0_auto]"
                    role="list"
                    aria-label="Chart legend"
                  >
                    {legendItems.map((item, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center gap-2 relative flex-[0_0_auto]"
                        role="listitem"
                      >
                        <div
                          className={`relative w-2 h-2 ${item.color} rounded`}
                          aria-hidden="true"
                        />
                        <span className="relative w-fit mt-[-1.00px] font-text-sm-normal font-[number:var(--text-sm-normal-font-weight)] text-gray-500 text-[length:var(--text-sm-normal-font-size)] tracking-[var(--text-sm-normal-letter-spacing)] leading-[var(--text-sm-normal-line-height)] whitespace-nowrap [font-style:var(--text-sm-normal-font-style)]">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col items-start justify-between relative flex-1 self-stretch w-full grow">
                    {chartYAxisLabels.map((label, index) => (
                      <div
                        key={index}
                        className={`flex h-[${label.height}] items-center gap-2 relative self-stretch w-full`}
                      >
                        <div className="relative w-8 font-text-xs-normal font-[number:var(--text-xs-normal-font-weight)] text-gray-500 text-[length:var(--text-xs-normal-font-size)] text-right tracking-[var(--text-xs-normal-letter-spacing)] leading-[var(--text-xs-normal-line-height)] [font-style:var(--text-xs-normal-font-style)]">
                          {label.value}
                        </div>
                        <div
                          className={`relative flex-1 grow h-px bg-[url(/divider-${index + 2}.svg)] bg-cover bg-[50%_50%]`}
                        />
                      </div>
                    ))}
                  </div>

                  <div
                    className="flex items-center justify-between pl-16 pr-6 py-0 relative self-stretch w-full flex-[0_0_auto]"
                    role="list"
                    aria-label="Week days"
                  >
                    {weekDays.map((day, index) => (
                      <div
                        key={index}
                        className="relative w-fit mt-[-1.00px] font-text-xs-normal font-[number:var(--text-xs-normal-font-weight)] text-gray-500 text-[length:var(--text-xs-normal-font-size)] text-center tracking-[var(--text-xs-normal-letter-spacing)] leading-[var(--text-xs-normal-line-height)] whitespace-nowrap [font-style:var(--text-xs-normal-font-style)]"
                        role="listitem"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-start justify-center gap-2.5 pt-2 pb-0 px-0 relative self-stretch w-full flex-[0_0_auto]">
                    <div className="relative w-fit mt-[-1.00px] font-text-xs-medium font-[number:var(--text-xs-medium-font-weight)] text-gray-500 text-[length:var(--text-xs-medium-font-size)] text-center tracking-[var(--text-xs-medium-letter-spacing)] leading-[var(--text-xs-medium-line-height)] whitespace-nowrap [font-style:var(--text-xs-medium-font-style)]">
                      {""}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="absolute w-[644px] h-[260px] top-4 left-[60px] bg-[url(/chart.svg)] bg-cover bg-[50%_50%]"
                role="img"
                aria-label="Learning activity chart showing weekly progress"
              />
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

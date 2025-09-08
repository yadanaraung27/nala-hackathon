import React, { useState } from "react";
import { BarChart01 } from "./BarChart01";

export const SidebarNavigationSection = (): JSX.Element => {
  const [activeItem, setActiveItem] = useState("Course");

  const navigationItems = [
    { id: "course", label: "Course", icon: BarChart01 },
    { id: "dailys", label: "Dailys", icon: BarChart01 },
    { id: "reporting", label: "Reporting", icon: BarChart01 },
  ];

  return (
    <nav
      className="flex w-[241px] h-[1701px] items-start absolute top-0 left-0 bg-[#5200f5] border-r [border-right-style:solid] border-gray-200"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex flex-col items-start justify-between relative flex-1 self-stretch grow">
        <div className="flex flex-col items-start gap-6 pt-8 pb-0 px-0 relative self-stretch w-full flex-[0_0_auto]">
          <header className="flex flex-col items-start px-6 py-0 relative self-stretch w-full flex-[0_0_auto]">
            <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
              <div className="relative self-stretch w-full h-11" />
            </div>
          </header>

          <ul
            className="flex flex-col items-start gap-[15px] px-4 py-0 relative self-stretch w-full flex-[0_0_auto]"
            role="list"
          >
            {navigationItems.map((item) => (
              <li
                key={item.id}
                className="flex items-start relative self-stretch w-full flex-[0_0_auto]"
              >
                <button
                  className="flex items-center gap-2 px-3 py-2 relative flex-1 self-stretch grow bg-basewhite rounded-md overflow-hidden hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                  onClick={() => setActiveItem(item.label)}
                  aria-current={activeItem === item.label ? "page" : undefined}
                  type="button"
                >
                  <div className="flex items-center gap-3 relative flex-1 grow">
                    <item.icon
                      className="!relative !w-6 !h-6"
                      aria-hidden="true"
                    />
                    <span className="relative w-fit mt-[-1.00px] font-text-md-medium font-[number:var(--text-md-medium-font-weight)] text-gray-700 text-[length:var(--text-md-medium-font-size)] tracking-[var(--text-md-medium-letter-spacing)] leading-[var(--text-md-medium-line-height)] whitespace-nowrap [font-style:var(--text-md-medium-font-style)]">
                      {item.label}
                    </span>
                  </div>
                  {(item.id === "dailys" || item.id === "reporting") && (
                    <div className="relative w-5 h-5" aria-hidden="true" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative self-stretch w-full h-[392px]" />
      </div>
    </nav>
  );
};

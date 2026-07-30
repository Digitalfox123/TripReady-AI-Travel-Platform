import React from "react";
import { motion } from "framer-motion";

export const TestimonialsColumn = (props) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div 
                  className="p-8 rounded-[24px] border bg-white dark:bg-[#081125] border-gray-200 dark:border-white/[0.08] shadow-lg shadow-black/[0.02] dark:shadow-black/[0.2] max-w-xs w-full text-left transition-colors duration-300" 
                  key={i}
                >
                  <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">"{text}"</div>
                  <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100 dark:border-white/[0.04]">
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-10 w-10 rounded-full object-cover border border-gray-200 dark:border-white/[0.1]"
                    />
                    <div className="flex flex-col">
                      <div className="font-heading font-bold text-gray-950 dark:text-white tracking-tight leading-none text-sm">{name}</div>
                      <div className="text-[11px] text-gray-500 dark:text-slate-400 mt-1 font-light tracking-wide uppercase leading-none">{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};
